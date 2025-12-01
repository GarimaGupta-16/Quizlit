// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fetch from "node-fetch";
import he from "he";
import { customAlphabet } from "nanoid";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",     // Vite local dev
      "https://quizlit.onrender.com"  // Render production
    ],
    methods: ["GET", "POST"]
  }
});


const nano = customAlphabet("0123456789", 6);
const rooms = new Map();
const safe = (cb) => (typeof cb === "function" ? cb : () => {});

const categoryMap = {
  "General Knowledge": 9,
  "Science: Computers": 18,
  "Science & Nature": 17,
  "Sports": 21,
  "History": 23,
  "Geography": 22,
  "Politics": 24,
  "Art": 25,
  "Animals": 27,
  "Vehicles": 28,
  "Maths": 19
};

function createRoom(settings, socket) {
  const code = nano();
  const room = {
    code,
    hostId: socket.id,
    settings,
    players: new Map(),
    questions: [],
    currentIndex: 0,
    started: false,
    questionLocked: false,
    timeLeft: 0,
    timer: null
  };
  rooms.set(code, room);
  return room;
}

function computeLeaderboard(room) {
  return [...room.players.values()].sort((a, b) => b.score - a.score);
}

function endQuiz(room) {
  clearInterval(room.timer);
  room.started = false;
  io.to(room.code).emit("quiz_end", {
    leaderboard: computeLeaderboard(room)
  });
}

function startQuizTimer(room) {
  const tpq = Number(room.settings.timePerQuestion);
  const total = room.questions.length;

  room.timeLeft = tpq * total;

  io.to(room.code).emit("timer", { timeLeft: room.timeLeft });

  room.timer = setInterval(() => {
    room.timeLeft -= 1;

    io.to(room.code).emit("timer", { timeLeft: room.timeLeft });

    if (room.timeLeft <= 0) {
      clearInterval(room.timer);
      endQuiz(room);
    }
  }, 1000);
}

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("create_room", ({ settings, playerName }, cb) => {
    cb = safe(cb);
    const room = createRoom(settings, socket);

    room.players.set(socket.id, { name: playerName, score: 0 });
    socket.join(room.code);

    cb({ ok: true, code: room.code });

    io.to(room.code).emit("room_update", {
      players: [...room.players.values()]
    });
  });

  socket.on("join_room", ({ code, playerName }, cb) => {
    cb = safe(cb);
    const room = rooms.get(code);
    if (!room) return cb({ ok: false, error: "Room not found" });
    if (room.started) return cb({ ok: false, error: "Quiz already started" });

    room.players.set(socket.id, { name: playerName, score: 0 });
    socket.join(code);

    io.to(code).emit("room_update", {
      players: [...room.players.values()]
    });

    cb({ ok: true });
  });

  socket.on("start_quiz", async ({ code }, cb) => {
    cb = safe(cb);
    const room = rooms.get(code);
    if (!room) return cb({ ok: false });

    const { topic, numQuestions } = room.settings;
    const categoryId = categoryMap[topic];
    const amount = Math.min(50, Number(numQuestions));

    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (categoryId) url += `&category=${categoryId}`;

    const data = await (await fetch(url)).json();

    room.questions = data.results.map((item, idx) => {
      const options = [
        he.decode(item.correct_answer),
        ...item.incorrect_answers.map((a) => he.decode(a))
      ].sort(() => Math.random() - 0.5);

      return {
        id: idx + 1,
        q: he.decode(item.question),
        options,
        answer: he.decode(item.correct_answer)
      };
    });

    room.currentIndex = 0;
    room.started = true;
    room.questionLocked = false;

    io.to(code).emit("quiz_started", {
      total: room.questions.length
    });

    io.to(code).emit("question", {
      index: 0,
      total: room.questions.length,
      timePerQuestion: Number(room.settings.timePerQuestion),
      q: room.questions[0]
    });

    startQuizTimer(room);

    cb({ ok: true });
  });

  socket.on("submit_answer", ({ code, answer }, cb) => {
    cb = safe(cb);
    const room = rooms.get(code);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    if (room.questionLocked) return;

    room.questionLocked = true;

    const q = room.questions[room.currentIndex];
    const isCorrect = answer === q.answer;

    if (isCorrect) player.score++;

    io.to(code).emit("answer_result", {
      firstResponder: player.name,
      correctAnswer: q.answer,
      chosen: answer,
      isCorrect
    });

    // 1.5s delay so users can see highlight
    setTimeout(() => {
      if (room.currentIndex >= room.questions.length - 1) {
        return endQuiz(room);
      }

      room.currentIndex++;
      room.questionLocked = false;

      io.to(code).emit("question", {
        index: room.currentIndex,
        total: room.questions.length,
        timePerQuestion: Number(room.settings.timePerQuestion),
        q: room.questions[room.currentIndex]
      });

      io.to(code).emit("timer", { timeLeft: room.timeLeft });

    }, 2500); // smooth delay
  });

  socket.on("disconnect", () => {
    for (const [code, room] of rooms.entries()) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);

        if (socket.id === room.hostId) {
          io.to(code).emit("room_closed");
          rooms.delete(code);
        }
      }
    }
  });
});

server.listen(4000, () => console.log("Server running on 4000"));
