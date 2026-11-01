
const PLAYER_NAME = "ГГ";
const MOVE_BEHAVIOR = "8Направлений";

runOnStartup(runtime =>
{
    runtime.addEventListener("beforeprojectstart", () =>
    {
        // Ищем первый экземпляр объекта на уровне
        function getObject(name)
        {
            const type = runtime.objects[name];

            if (!type)
            {
                console.error("Нет объекта: " + name);
                return null;
            }

            const instance = type.getFirstInstance();

            if (!instance)
                console.error("Нет экземпляра: " + name);

            return instance;
        }

        const player = getObject(PLAYER_NAME);
        const fuseBox = getObject("FuseBox");
        const worldNote = getObject("WorldNote");

        const boardPanel = getObject("BoardPanel");
        const panelSwitch1 = getObject("PanelSwitch1");
        const panelSwitch2 = getObject("PanelSwitch2");
        const panelSwitch3 = getObject("PanelSwitch3");

        const notePanel = getObject("NotePanel");
        const noteBody = getObject("NoteBody");
        const screenDim = getObject("ScreenDim");

        const powerLamp = getObject("PowerLamp");
        const door = getObject("Door");
        const winText = getObject("WinText");

        const keyboard = runtime.keyboard;
        const mouse = runtime.mouse;

        const movement = player?.behaviors[MOVE_BEHAVIOR];

        const required = [
            player, fuseBox, worldNote,
            boardPanel, panelSwitch1, panelSwitch2,
            panelSwitch3, notePanel, noteBody,
            screenDim, powerLamp, door,
            keyboard, mouse, movement, winText
        ];

        if (required.some(item => !item))
        {
            console.error(
                "Головоломка не запущена. Проверь объекты и 8Direction."
            );
            return;
        }

        // Три тумблера: правильная комбинация — ВКЛ, ВЫКЛ, ВКЛ
        const switches = [
            { instance: panelSwitch1, on: false, target: true },
            { instance: panelSwitch2, on: false, target: false },
            { instance: panelSwitch3, on: false, target: true }
        ];

        // Расстояние, на котором можно взаимодействовать с объектами
        const INTERACTION_DISTANCE = 100;

        // Запоминаем расположение интерфейсных элементов
        // относительно фона щитка и фона записки
        const boardOffsets = switches.map(sw => ({
            x: sw.instance.x - boardPanel.x,
            y: sw.instance.y - boardPanel.y
        }));

        const noteOffset = {
            x: noteBody.x - notePanel.x,
            y: noteBody.y - notePanel.y
        };

        let openScreen = null;
        let solved = false;

        let wasE = false;
        let wasEsc = false;
        let wasMouseDown = false;

        // Устанавливаем начальные состояния
        switches.forEach(sw =>
        {
            sw.instance.setAnimation("Off");
        });

        powerLamp.setAnimation("Off");
        door.setAnimation("Closed");

        noteBody.text =
            "ВОССТАНОВЛЕНИЕ ПИТАНИЯ\n\n" +
            "Контур 1 — включить.\n" +
            "Контур 2 — оставить отключённым.\n" +
            "Контур 3 — включить.\n\n" +
            "После настройки перезапустите контур.";

        // Все интерфейсные объекты — сверху, остальные — под ними
        const uiObjects = [
            screenDim,
            boardPanel,
            panelSwitch1,
            panelSwitch2,
            panelSwitch3,
            notePanel,
            noteBody
        ];

        uiObjects.forEach(obj =>
        {
            obj.isVisible = false;
        });

        screenDim.opacity = 0.65;

        // Перемещаем интерфейс к центру экрана.
        // Работает с камерой, следующей за персонажем.
        function positionUI()
        {
            const cx = runtime.layout.scrollX;
            const cy = runtime.layout.scrollY;

            screenDim.setPosition(cx, cy);
            screenDim.setSize(
                runtime.viewportWidth,
                runtime.viewportHeight
            );

            boardPanel.setPosition(cx, cy);

            switches.forEach((sw, i) =>
            {
                sw.instance.setPosition(
                    cx + boardOffsets[i].x,
                    cy + boardOffsets[i].y
                );
            });

            notePanel.setPosition(cx, cy);

            noteBody.setPosition(
                cx + noteOffset.x,
                cy + noteOffset.y
            );
        }

        // Открываем экран: "board" или "note"
        function openUI(name)
        {
            openScreen = name;

            movement.stop();
            movement.isEnabled = false;

            positionUI();

            screenDim.isVisible = true;

            boardPanel.isVisible = name === "board";

            switches.forEach(sw =>
            {
                sw.instance.isVisible = name === "board";
            });

            notePanel.isVisible = name === "note";
            noteBody.isVisible = name === "note";

            // Располагаем элементы в нужном порядке от заднего к переднему
            uiObjects.forEach(obj => obj.moveToTop());
        }

        function closeUI()
        {
            openScreen = null;

            uiObjects.forEach(obj =>
            {
                obj.isVisible = false;
            });

            movement.isEnabled = true;
        }

        // Проверяем решение головоломки
        function checkSolution()
        {
            const correct = switches.every(
                sw => sw.on === sw.target
            );

            if (!correct)
                return;

            solved = true;

            powerLamp.setAnimation("On");
            door.setAnimation("Open");

            closeUI();

            console.log("Головоломка решена!");
        }

        // Основной цикл
        runtime.addEventListener("tick", () =>
        {
            const eDown = keyboard.isKeyDown("KeyE");
            const escDown = keyboard.isKeyDown("KeyE");
            const mouseDown = mouse.isMouseButtonDown(0);

            const ePressed = eDown && !wasE;
            const escPressed = escDown && !wasEsc;
            const mousePressed = mouseDown && !wasMouseDown;

            wasE = eDown;
            wasEsc = escDown;
            wasMouseDown = mouseDown;

            // Проверяем выход через дверь после решения головоломки
            if (solved && player.x > door.x + door.width / 2)
            {
                screenDim.isVisible = true;
                winText.isVisible = true;
                winText.text = "Уровень пройден!";
                winText.setPosition(
                    runtime.layout.scrollX,
                    runtime.layout.scrollY
                );
                screenDim.setPosition(
                    runtime.layout.scrollX,
                    runtime.layout.scrollY
                );

                movement.isEnabled = false;
                return;
            }

            // Если экран открыт, обрабатываем только его
            if (openScreen !== null)
            {
                positionUI();

                if (escPressed)
                {
                    closeUI();
                    return;
                }

                // На экране щитка можно нажимать тумблеры мышью
                if (openScreen === "board" && mousePressed && !solved)
                {
                    const [mx, my] = mouse.getMousePosition();

                    for (const sw of switches)
                    {
                        if (sw.instance.containsPoint(mx, my))
                        {
                            sw.on = !sw.on;

                            sw.instance.setAnimation(
                                sw.on ? "On" : "Off"
                            );

                            checkSolution();
                            break;
                        }
                    }
                }

                return;
            }

            // Экран закрыт: ищем ближайший объект для взаимодействия
            if (!ePressed)
                return;

            const boxDistance = Math.hypot(
                player.x - fuseBox.x,
                player.y - fuseBox.y
            );

            const noteDistance = Math.hypot(
                player.x - worldNote.x,
                player.y - worldNote.y
            );

            if (
                boxDistance <= INTERACTION_DISTANCE &&
                boxDistance <= noteDistance
            )
            {
                openUI("board");
            }
            else if (noteDistance <= INTERACTION_DISTANCE)
            {
                openUI("note");
            }
        });
    });
});
