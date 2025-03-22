document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.button');
    const container = document.querySelector('.container');
    const attemptCounter = document.getElementById('attempt-counter');
    const successCounter = document.getElementById('success-counter');
    const successRate = document.getElementById('success-rate'); // New element for success rate

    // Variables to track mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseSpeedX = 0;
    let mouseSpeedY = 0;

    // Button position
    let buttonX = window.innerWidth / 2;
    let buttonY = window.innerHeight / 2;

    // Counters for attempts and successes
    let attempts = 0;
    let successes = 0;

    // Flag to check if the button is stuck
    let isStuck = false;

    // Function to calculate and update the success rate
    function updateSuccessRate() {
        if (attempts === 0) {
            successRate.textContent = '0%'; // Avoid division by zero
        } else {
            const rate = (successes / attempts) * 100;
            successRate.textContent = `${rate.toFixed(2)}%`; // Show success rate with 2 decimal places
        }
    }

    // Update button position
    function updateButtonPosition() {
        button.style.left = `${buttonX}px`;
        button.style.top = `${buttonY}px`;
    }

    // Initialize button position
    updateButtonPosition();

    // Track mouse position and calculate speed
    document.addEventListener('mousemove', (e) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Calculate mouse speed
        mouseSpeedX = Math.abs(mouseX - prevMouseX);
        mouseSpeedY = Math.abs(mouseY - prevMouseY);
    });

    // Function to check if the button is stuck in a corner
    function isButtonStuck() {
        const padding = 20;
        const buttonRect = button.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

        return (
            buttonX <= buttonWidth / 2 + padding ||
            buttonX >= window.innerWidth - buttonWidth / 2 - padding ||
            buttonY <= buttonHeight / 2 + padding ||
            buttonY >= window.innerHeight - buttonHeight / 2 - padding
        );
    }

    // Function to smoothly move the button to a random position
    function moveButtonToRandomPosition() {
        const randomX = Math.random() * (window.innerWidth - 200) + 100;
        const randomY = Math.random() * (window.innerHeight - 200) + 100;

        // Smoothly animate the button to the new position
        const duration = 500; // Animation duration in milliseconds
        const startX = buttonX;
        const startY = buttonY;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            buttonX = startX + (randomX - startX) * progress;
            buttonY = startY + (randomY - startY) * progress;
            updateButtonPosition();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isStuck = false; // Reset the stuck flag after moving
            }
        }

        requestAnimationFrame(animate);
    }

    // Function to check proximity and move the button
    function moveButton() {
        // Get button dimensions
        const buttonRect = button.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

        // Calculate distance between mouse and button center
        const buttonCenterX = buttonX;
        const buttonCenterY = buttonY;
        const distanceX = mouseX - buttonCenterX;
        const distanceY = mouseY - buttonCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Threshold for button movement (adjusted based on button size)
        const threshold = Math.max(buttonWidth, buttonHeight) * 1.5;

        if (distance < threshold) {
            // Calculate escape direction (away from mouse)
            const angle = Math.atan2(distanceY, distanceX);

            // Calculate escape speed based on mouse speed and proximity
            // The closer the mouse, the faster the button moves
            const proximityFactor = 1 - (distance / threshold);
            const mouseSpeed = Math.sqrt(mouseSpeedX * mouseSpeedX + mouseSpeedY * mouseSpeedY);
            const baseSpeed = 10;
            const speedFactor = 1 + (mouseSpeed / 10);
            const escapeSpeed = baseSpeed * proximityFactor * speedFactor;

            // Move button in the opposite direction
            buttonX -= Math.cos(angle) * escapeSpeed;
            buttonY -= Math.sin(angle) * escapeSpeed;

            // Keep button within window bounds with padding
            const padding = 20;
            buttonX = Math.max(buttonWidth / 2 + padding, Math.min(window.innerWidth - buttonWidth / 2 - padding, buttonX));
            buttonY = Math.max(buttonHeight / 2 + padding, Math.min(window.innerHeight - buttonHeight / 2 - padding, buttonY));

            // Check if the button is stuck in a corner
            if (isButtonStuck() && !isStuck) {
                isStuck = true;
                moveButtonToRandomPosition(); // Move the button to a random position
            }

            updateButtonPosition();
        }

        requestAnimationFrame(moveButton);
    }

    // Start the animation loop
    moveButton();

    // Track click attempts
    button.addEventListener('mousedown', () => {
        // If they somehow manage to click it
        successes++;
        successCounter.textContent = successes;

        // Update success rate
        updateSuccessRate();

        // Trigger confetti effect at the button's position
        const buttonRect = button.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        // Create a circular confetti effect
        const count = 50; // Number of confetti particles
        const defaults = {
            origin: {
                x: buttonCenterX / window.innerWidth,
                y: buttonCenterY / window.innerHeight
            },
            spread: 360, // Full circle
            startVelocity: 30,
            gravity: 0.5,
            drift: 0,
            ticks: 100,
            particleCount: count,
            shapes: ['circle'], // Only use circle-shaped confetti
            scalar: 1.2,
            zIndex: 1000,
        };

        confetti({
            ...defaults,
            angle: 0, // Start angle
        });

        confetti({
            ...defaults,
            angle: 90, // 90 degrees
        });

        confetti({
            ...defaults,
            angle: 180, // 180 degrees
        });

        confetti({
            ...defaults,
            angle: 270, // 270 degrees
        });

        // Make it harder next time
        button.style.transition = 'none';
        const randomX = Math.random() * (window.innerWidth - 200) + 100;
        const randomY = Math.random() * (window.innerHeight - 200) + 100;
        buttonX = randomX;
        buttonY = randomY;
        updateButtonPosition();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        // Keep button within new window bounds
        buttonX = Math.min(window.innerWidth - 100, buttonX);
        buttonY = Math.min(window.innerHeight - 100, buttonY);
        updateButtonPosition();
    });

    // Add attempt counter for all clicks that are not on the button
    document.addEventListener('click', (e) => {
        if (e.target !== button) {
            attempts++;
            attemptCounter.textContent = attempts;

            // Update success rate
            updateSuccessRate();
        }
    });
});