const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const game = {
    pointerDown: false,
    pointerX: null,
    pointerY: null,
    pointerTargetOhajikiId: null,
    ohajikiId: 0
};

window.addEventListener("resize", () => {
    resizeCanvas(canvas, ctx);
});

canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    updatePointerPosition(e);
    game.pointerDown = true;
    for (const o of ohajikiArray) {
        const distance = Math.pow(game.pointerX - o.x, 2) + Math.pow(game.pointerY - o.y, 2);
        if (distance < Math.pow(o.radius, 2)) {
            game.pointerTargetOhajikiId = o.id;
            break;
        }
    }
});

canvas.addEventListener("pointermove", (e) => {
    e.preventDefault();
    updatePointerPosition(e);
});

canvas.addEventListener("pointerup", (e) => {
    e.preventDefault();
    updatePointerPosition(e);
    game.pointerDown = false;
});

const ohajikiArray = [];
for (let x = 1; x < 20; x += 2) {
    for (let y = 1; y < 20; y += 2) {
        if (y === 1) {
            ohajikiArray.push(createOhajiki(x / 20, y / 20, 0.02, y * 5, "rgba(0, 0, 255, 1)"));
        }
        else if (y === 19) {
            ohajikiArray.push(createOhajiki(x / 20, y / 20, 0.02, y * 5, "rgba(255, 0, 0, 1)"));
        }
        else {
            ohajikiArray.push(createOhajiki(x / 20, y / 20, 0.02, y * 5, "rgba(255, 255, 0, 1)"));
        }
    }
}
ohajikiArray.push(createOhajiki(0.4, 1.5, 0.2, 200, "rgba(255, 100, 0, 1)"));
ohajikiArray.push(createOhajiki(0.8, 1.5, 0.1, 5, "rgba(0, 100, 100, 1)"));
ohajikiArray.push(createOhajiki(0.8, 1.8, 0.1, 5, "rgba(100, 0, 100, 1)"));
ohajikiArray.push(createOhajiki(0.2, 1.8, 0.05, 400, "rgba(255, 0, 100, 1)"));

resizeCanvas(canvas);
mainLoop();

function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const o of ohajikiArray) {
        o.draw(canvas, ctx);
        o.update();
    }

    const pointerTarget = ohajikiArray.find(o => (o.id === game.pointerTargetOhajikiId));
    if (pointerTarget !== undefined) {
        if (game.pointerDown) {
            pointerTarget.tx = game.pointerX - pointerTarget.x;
            pointerTarget.ty = game.pointerY - pointerTarget.y;
        }
        else {
            pointerTarget.gx = -pointerTarget.tx / 30;
            pointerTarget.gy = -pointerTarget.ty / 30;
            pointerTarget.tx = null;
            pointerTarget.ty = null;
            game.pointerTargetOhajikiId = null;
        }
    }

    requestAnimationFrame(mainLoop);
}

function resizeCanvas(canvas) {
    //ウィンドウの大きさ
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight / 2) * 2;

    //画面上の表示サイズ
    let displayWidth, displayHeight;

    if ((h / 2) > w) {
        //縦が余る
        displayWidth = w;
        displayHeight = w * 2;
    } else {
        //横が余る
        displayWidth = h / 2;
        displayHeight = h;
    }

    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    const dpr = window.devicePixelRatio || 1;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
}

function updatePointerPosition(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    game.pointerX = (e.clientX - rect.left) / rect.width;
    game.pointerY = (e.clientY - rect.top) / rect.width;
}

function createOhajiki(x, y, radius, weight, color) {
    game.ohajikiId++;
    return new ohajiki(game.ohajikiId, x, y, radius, weight, color);
}
