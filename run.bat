@echo off

REM Navigate to the backend directory and start the Flask app
cd Backend
start cmd /k npm start

REM Pause for a few seconds to ensure Flask has started
timeout /t 2

REM Navigate to the frontend directory and start the React app using npm
cd ../FrontEnd/KanBanBoard
start cmd /k npm start
