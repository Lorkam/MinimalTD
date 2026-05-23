# MinimalTD

MinimalTD is a web-based Tower Defense game that features classic strategic gameplay combined with 3D graphics, a technology progression system, and progress saving.

## Features

* **Classic Tower Defense:** Defend your base against waves of varied enemies by strategically placing and upgrading towers.
* **3D Graphics:** Enemies and game elements are rendered using 3D models (`.glb` format).
* **Technology Tree:** Unlock and upgrade new abilities and tower stats through a dedicated tech tree.
* **Bestiary:** Track and learn about the different enemies you encounter throughout the game.
* **Save System:** Your progress, including unlocked technologies and levels, is saved using a PHP/JSON backend.

## Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS & TreeJS for 3D rendering).
* **Backend:** PHP (for handling game logic data, file reading, and save states).
* **Data Storage:** JSON (Levels, enemies, towers, and save files).

## How to Run

Since this project uses PHP for saving and data management, you need a local web server environment (such as XAMPP, WAMP, MAMP, or the built-in PHP server) to run it properly.

1. Clone or download this repository.
2. Place the `MinimalTD` folder into your local web server's root directory (e.g., `htdocs` for XAMPP, `www` for WAMP).
3. Start your Apache/PHP server.
4. Open your web browser and navigate to the project URL, typically:
   `http://localhost/MinimalTD/app/pages/menuPrincipale.php` (Adjust the path based on your server setup).

## Project Structure

* `app/src/`: Contains all the JavaScript logic for the game, technologies, bestiary, and UI.
* `app/serv/`: PHP scripts and JSON files managing the backend data (saves, stats, levels).
* `app/pages/`: Frontend HTML/PHP pages (Main Menu, Game, Bestiary, Tech Tree).
* `app/assets/`: Images, CSS, and 3D models (`.glb` files) used in the game.
