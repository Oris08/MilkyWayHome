
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

import "./electro1.js";

const PLAYER_NAME = "ГГ";
const MOVE_BEHAVIOR = "8Направлений";

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));

	runtime.addEventListener("beforeprojectstart", () =>
    {
        const player = runtime.objects[PLAYER_NAME].getFirstInstance();
        const movement = player.behaviors[MOVE_BEHAVIOR];

        runtime.addEventListener("tick", () =>
        {
            // WASD: вызываем только для нажатых клавиш
            if (runtime.keyboard.isKeyDown("KeyW"))
                movement.simulateControl("up");

            if (runtime.keyboard.isKeyDown("KeyA"))
                movement.simulateControl("left");

            if (runtime.keyboard.isKeyDown("KeyS"))
                movement.simulateControl("down");

            if (runtime.keyboard.isKeyDown("KeyD"))
                movement.simulateControl("right");
        });
    });
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{

}




let lastDirection = "Down";

runOnStartup(runtime =>
{
	runtime.addEventListener("beforeprojectstart", () =>
	{
		const playerType = runtime.objects[PLAYER_NAME];

		if (!playerType)
		{
			console.error("Не найден объект: " + PLAYER_NAME);
			return;
		}

		const player = playerType.getFirstInstance();

		if (!player)
		{
			console.error("На уровне нет персонажа!");
			return;
		}

		const movement = player.behaviors[MOVE_BEHAVIOR];

		if (!movement)
		{
			console.error("Не найдено поведение: " + MOVE_BEHAVIOR);
			return;
		}

		runtime.addEventListener("tick", () =>
		{
			const x = movement.vectorX;
			const y = movement.vectorY;
			const isMoving = movement.speed > 1;

			if (isMoving)
			{
				if (Math.abs(x) > Math.abs(y))
					lastDirection = x < 0 ? "Left" : "Right";
				else
					lastDirection = y < 0 ? "Up" : "Down";
			}

			const animation = isMoving
				? "Walk" + lastDirection
				: "Idle";

			if (player.animationName !== animation)
				player.setAnimation(animation);
		});
	});
});


