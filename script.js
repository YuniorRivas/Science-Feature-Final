document.addEventListener("DOMContentLoaded", () => {
    const floatingItems = document.querySelectorAll(".floating-item");
    const container = document.querySelector(".interactive-area");
    const infoDisplay = document.querySelector(".info-display");
    const infoTitle = document.querySelector(".info-title");
    const infoSources = document.getElementById("info-sources");
    const infoSymptoms = document.getElementById("info-symptoms");
    const infoLength = document.getElementById("info-length");
    const infoPrevention= document.getElementById("info-prevention");
    const infoWhattodo = document.getElementById("info-whattodo");
    const closeInfo = document.getElementById("close-info");
    const pauseButton = document.getElementById("pause-animation");
    const zoomedPathogen = document.getElementById("zoomed-pathogen");

    const radii = 75; 
    const positions = [];
    const velocities = [];
    const speed = 3; // Consistent speed for all pathogens
    let animationRunning = true;

    const containerBounds = container.getBoundingClientRect();

    // Initialize Pathogens
    floatingItems.forEach((item, index) => {
        const randomX = Math.random() * (containerBounds.width - radii * 2);
        const randomY = Math.random() * (containerBounds.height - radii * 2);
        const angle = Math.random() * Math.PI * 2; // Random direction

        item.style.left = `${randomX}px`;
        item.style.top = `${randomY}px`;

        positions.push({ x: randomX, y: randomY });
        velocities.push({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
    });

    // Detect Collisions Between Pathogens
    function detectCollision(index1, index2) {
        const dx = positions[index1].x - positions[index2].x;
        const dy = positions[index1].y - positions[index2].y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        return distance < radii * 2; // Collision if distance < sum of radii
    }

    // Resolve Collision and Add Squish Effect
    function resolveCollision(index1, index2) {
        const dx = positions[index1].x - positions[index2].x;
        const dy = positions[index1].y - positions[index2].y;

        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance === 0) return; // Prevent division by zero

        const nx = dx / distance;
        const ny = dy / distance;

        const overlap = radii * 2 - distance;
        const adjustmentX = (overlap / 2) * nx;
        const adjustmentY = (overlap / 2) * ny;

        positions[index1].x += adjustmentX;
        positions[index1].y += adjustmentY;
        positions[index2].x -= adjustmentX;
        positions[index2].y -= adjustmentY;

        const relativeVelocityX = velocities[index1].x - velocities[index2].x;
        const relativeVelocityY = velocities[index1].y - velocities[index2].y;

        const dotProduct = relativeVelocityX * nx + relativeVelocityY * ny;

        velocities[index1].x -= dotProduct * nx;
        velocities[index1].y -= dotProduct * ny;

        velocities[index2].x += dotProduct * nx;
        velocities[index2].y += dotProduct * ny;

        // Determine squish direction
        const isHorizontalCollision = Math.abs(dx) > Math.abs(dy);

        // Apply squish effect based on collision direction
        if (isHorizontalCollision) {
            addSquishEffect(floatingItems[index1], "horizontal");
            addSquishEffect(floatingItems[index2], "horizontal");
        } else {
            addSquishEffect(floatingItems[index1], "vertical");
            addSquishEffect(floatingItems[index2], "vertical");
        }
    }

    // Add Squish Effect to Element
    function addSquishEffect(element, direction) {
        const squishClass = direction === "horizontal" ? "squish-horizontal" : "squish-vertical";
        element.classList.add(squishClass);
        // Remove the class after the animation duration to make it reusable
        setTimeout(() => {
            element.classList.remove(squishClass);
        }, 300); // Match the animation duration defined in CSS
    }

    // Movement Logic
    function moveItems() {
        if (!animationRunning) return;

        floatingItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();

            // Update positions
            positions[index].x += velocities[index].x;
            positions[index].y += velocities[index].y;

            // Edge bouncing
            if (positions[index].x <= 0 || positions[index].x >= containerBounds.width - rect.width) {
                velocities[index].x *= -1;
                positions[index].x = Math.max(0, Math.min(positions[index].x, containerBounds.width - rect.width));
            }
            if (positions[index].y <= 0 || positions[index].y >= containerBounds.height - rect.height) {
                velocities[index].y *= -1;
                positions[index].y = Math.max(0, Math.min(positions[index].y, containerBounds.height - rect.height));
            }

            // Collision detection and resolution
            floatingItems.forEach((_, otherIndex) => {
                if (index !== otherIndex && detectCollision(index, otherIndex)) {
                    resolveCollision(index, otherIndex);
                }
            });

            // Update DOM position
            item.style.left = `${positions[index].x}px`;
            item.style.top = `${positions[index].y}px`;
        });

        requestAnimationFrame(moveItems);
    }

    // Start Animation
    moveItems();

    // Pause Animation Button
    pauseButton.addEventListener("click", () => {
        animationRunning = !animationRunning;
        pauseButton.textContent = animationRunning ? "Pause Animation" : "Resume Animation";
        if (animationRunning) moveItems();
    });

    // Pathogen Info Display
    floatingItems.forEach(item => {
        item.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent propagation to parent elements

            const target = event.currentTarget; // The clicked pathogen
            const name = target.dataset.name || "Unknown Pathogen";
            const info = target.dataset.info || "";
            const details = info.split('. ');

            // Check if all details are present
            if (details.length < 3) {
                console.error("Invalid data-info format:", info);
                return;
            }

            const sources = details[0];
            const symptoms = details[1];
            const length = details[2];

            // Update Info Display
            infoTitle.textContent = name;
            infoSources.textContent = sources;
            infoSymptoms.textContent = symptoms;
            infoLength.textContent = length;
            zoomedPathogen.src = target.querySelector("img").src;

            // Show Info Display
            infoDisplay.classList.remove("hidden");
            animationRunning = false; // Pause animation when info is displayed
        });
    });

    // Close Info Display
    closeInfo.addEventListener("click", () => {
        infoDisplay.classList.add("hidden");
        animationRunning = true; // Resume animation when info display is closed
        moveItems(); // Ensure animation resumes immediately
    });

    /* Timeline Dragging */
        const timelineContainer = document.querySelector('.-container');
        let isDragging = false;
        let startX;
        let scrollLeft;

        timelineContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - timelineContainer.offsetLeft;
            scrollLeft = timelineContainer.scrollLeft;
        });

        timelineContainer.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        timelineContainer.addEventListener('mouseup', () => {
            isDragging = false;
        });

        timelineContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            const walk = (x - startX) * 2; // Adjust the speed
            timelineContainer.scrollLeft = scrollLeft - walk;
        });

        ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(event => {
            timelineContainer.addEventListener(event, () => {
                isDragging = false;
                timelineContainer.style.cursor = "grab";
            });
        });

        timelineContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - timelineContainer.offsetLeft;
            scrollLeft = timelineContainer.scrollLeft;
        });

        timelineContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - timelineContainer.offsetLeft;
            const walk = (x - startX) * 1;
            timelineContainer.scrollLeft = scrollLeft - walk;
        });
});
