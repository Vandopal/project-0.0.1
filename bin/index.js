// Получение ссылки на холст
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// Создание объектов изображений модели
var playerImages = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image()
};

// Загрузка изображений модели
playerImages.up.src = "custom/skeleton-up2.png"; // Замените "custom/skeleton-up2.png" на путь к изображению модели, смотрящей вверх
playerImages.down.src = "custom/skeleton-down2.png"; // Замените "custom/skeleton-down2.png" на путь к изображению модели, смотрящей вниз
playerImages.left.src = "custom/skeleton-left2.png"; // Замените "custom/skeleton-left2.png" на путь к изображению модели, смотрящей влево
playerImages.right.src = "custom/skeleton-right2.png"; // Замените "custom/skeleton-right2.png" на путь к изображению модели, смотрящей вправо

// Создание объекта анимации стрелы
var arrowAnimation = new Image();
arrowAnimation.src = "custom/2345.gif"; // Замените "custom/re.gif" на путь к анимированному GIF-файлу стрелы

// Начальные координаты и направление игрока
var playerX = canvas.width / 2;
var playerY = canvas.height / 2;
var playerWidth = 50;
var playerHeight = 50;
var playerSpeed = 5;
var playerDirection = "down"; // Начальное направление взгляда модели

// Массив для хранения текущих нажатых клавиш
var keys = {};

// Обработка нажатия и отпускания клавиш
document.addEventListener("keydown", function(event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
  keys[event.key] = false;
});

// Определение стенок в игре
var walls = [
  { x: 200, y: 100, width: 20, height: 200 }, // Пример стенки: x=200, y=100, width=20, height=200
  // Добавьте остальные стенки в игре по аналогии
];

// Определение стрелы
var arrow = {
  x: Math.random() * (canvas.width - 20),
  y: Math.random() * (canvas.height - 20),
  width: 20,
  height: 20,
  speed: Math.random() * 3 + 1,
  direction: Math.random() * 2 * Math.PI
};

// Функция для обновления положения стрелы
function updateArrow() {
  arrow.x += Math.cos(arrow.direction) * arrow.speed;
  arrow.y += Math.sin(arrow.direction) * arrow.speed;

  // Проверка выхода стрелы за пределы холста и изменение направления
  if (
    arrow.x < 0 ||
    arrow.x + arrow.width > canvas.width ||
    arrow.y < 0 ||
    arrow.y + arrow.height > canvas.height
  ) {
    arrow.x = Math.random() * (canvas.width - 20);
    arrow.y = Math.random() * (canvas.height - 20);
    arrow.direction = Math.random() * 2 * Math.PI;
    arrow.speed = Math.random() * 3 + 1;
  }
}

// Функция для проверки столкновения игрока с каждой стенкой
function checkCollisionWithWalls() {
  for (var i = 0; i < walls.length; i++) {
    var wall = walls[i];

    if (
      playerX < wall.x + wall.width &&
      playerX + playerWidth > wall.x &&
      playerY < wall.y + wall.height &&
      playerY + playerHeight > wall.y
    ) {

    }
  }
}

// Функция для проверки столкновения игрока со стрелой
function checkCollisionWithArrow() {
  if (
    playerX < arrow.x + arrow.width &&
    playerX + playerWidth > arrow.x &&
    playerY < arrow.y + arrow.height &&
    playerY + playerHeight > arrow.y
  ) {
    // Игрок столкнулся со стрелой, нанесите урон игроку
    // Например, уменьшите его здоровье или выполните другие действия
  }
}

// Обновление игры и отрисовка игрока и стрелы
function update() {
  // Проверка нажатых клавиш и изменение координат игрока
  if (keys["ArrowUp"]) {
    playerY -= playerSpeed;
    if (playerY < 0) {
      playerY = 0;
    }
    playerDirection = "up";
  }

  if (keys["ArrowDown"]) {
    playerY += playerSpeed;
    if (playerY > canvas.height - playerHeight) {
      playerY = canvas.height - playerHeight;
    }
    playerDirection = "down";
  }

  if (keys["ArrowLeft"]) {
    playerX -= playerSpeed;
    if (playerX < 0) {
      playerX = 0;
    }
    playerDirection = "left";
  }

  if (keys["ArrowRight"]) {
    playerX += playerSpeed;
    if (playerX > canvas.width - playerWidth) {
      playerX = canvas.width - playerWidth;
    }
    playerDirection = "right";
  }

  // Проверка столкновений со стенками
  checkCollisionWithWalls();

  // Проверка столкновения с стрелой
  checkCollisionWithArrow();

  // Очистка холста
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка игрока в зависимости от направления взгляда
  switch (playerDirection) {
    case "up":
      context.drawImage(playerImages.up, playerX, playerY, playerWidth, playerHeight);
      break;
    case "down":
      context.drawImage(playerImages.down, playerX, playerY, playerWidth, playerHeight);
      break;
    case "left":
      context.drawImage(playerImages.left, playerX, playerY, playerWidth, playerHeight);
      break;
    case "right":
      context.drawImage(playerImages.right, playerX, playerY, playerWidth, playerHeight);
      break;
  }

  // Отрисовка анимации стрелы
  context.drawImage(arrowAnimation, arrow.x, arrow.y, arrow.width, arrow.height);

  // Обновление координат стрелы
  updateArrow();

  // Повторный вызов функции обновления для создания анимации
  requestAnimationFrame(update);
}

// Запуск игры после загрузки изображений модели
Promise.all([
  new Promise((resolve, reject) => {
    playerImages.up.onload = resolve;
  }),
  new Promise((resolve, reject) => {
    playerImages.down.onload = resolve;
  }),
  new Promise((resolve, reject) => {
    playerImages.left.onload = resolve;
  }),
  new Promise((resolve, reject) => {
    playerImages.right.onload = resolve;
  }),
  new Promise((resolve, reject) => {
    arrowAnimation.onload = resolve;
  })
]).then(() => {
  update();
});