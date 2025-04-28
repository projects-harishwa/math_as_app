//Taylor----------------------------------------------------------------------------
 // Function to compute Taylor series approximation
 function computeTaylorSeries(equation, x0, y0, h, xg) {
    const results = [];
    const dydx = math.compile(equation);

    // Helper to calculate nth derivative (numerical differentiation)
    const nthDerivative = (f, x, y, n, h = 1e-5) => {
        if (n === 1) return f.evaluate({ x, y });
        return (nthDerivative(f, x + h, y, n - 1, h) - nthDerivative(f, x - h, y, n - 1, h)) / (2 * h);
    };

    let currentX = x0;
    let currentY = y0;

    while (currentX < xg) {
        let terms = [];
        let sum = currentY;

        for (let n = 1; n <= 5; n++) { // Default to 5 terms
            const derivativeValue = nthDerivative(dydx, currentX, currentY, n);
            const term = (Math.pow(h, n) / factorial(n)) * derivativeValue;
            terms.push(term.toFixed(5));
            sum += term;
        }

        results.push({
            x: currentX.toFixed(5),
            y: currentY.toFixed(5),
            terms,
            newY: sum.toFixed(5)
        });

        currentY = sum;
        currentX += h;
    }

    return results;
}

// Helper function to calculate factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function calculateTaylorSeries() {
    const equation = document.getElementById("taylorEquation").value;
    const x0 = parseFloat(document.getElementById("taylorX0").value);
    const y0 = parseFloat(document.getElementById("taylorY0").value);
    const h = parseFloat(document.getElementById("taylorH").value);
    const xg = parseFloat(document.getElementById("taylorXg").value);

    // Check for empty inputs
    if (!equation || isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xg)) {
        alert("Please fill in all fields correctly before calculating.");
        return;
    }

    // Clear previous results
    document.getElementById("taylorResult").textContent = "";
    document.getElementById("taylorDetails").textContent = "";

    try {
        // Compute Taylor series
        const results = computeTaylorSeries(equation, x0, y0, h, xg);

        // Display final result
        const lastResult = results[results.length - 1];
        document.getElementById("taylorResult").textContent = `The value of y(${parseFloat(lastResult.x).toFixed(2)}) is = ${parseFloat(lastResult.newY)}`;


        // Display detailed iterations
        const details = results.map(r => {
            return `x = ${r.x}, y = ${r.y}, New y = ${r.newY}, Terms = [${r.terms.join(", ")}].`;
        }).join("\n\n");

        document.getElementById("taylorDetails").textContent = details;
    } catch (error) {
        alert("Invalid equation format. Please ensure the equation is correct.");
    }
}

function clearTaylorResults() {
    document.getElementById("taylorResult").textContent = "";
    document.getElementById("taylorDetails").textContent = "";
}


//Eulers method---------------------------------------------------------------------------

// Function to compute Euler's method approximation
function computeEulersMethod(equation, x0, y0, h, xg) {
    const results = [];
    const dydx = math.compile(equation);

    let currentX = x0;
    let currentY = y0;

    while (currentX < xg) {
        const slope = dydx.evaluate({ x: currentX, y: currentY });
        const nextY = currentY + h * slope;

        results.push({
            x: currentX,
            y: currentY,
            nextY: nextY
        });

        currentY = nextY;
        currentX += h;
    }

    return results;
}

function calculateEulersMethod() {
    const equation = document.getElementById("eulerEquation").value;
    const x0 = parseFloat(document.getElementById("eulerX0").value);
    const y0 = parseFloat(document.getElementById("eulerY0").value);
    const h = parseFloat(document.getElementById("eulerH").value);
    const xg = parseFloat(document.getElementById("eulerXg").value);

    // Check for empty inputs
    if (!equation || isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xg)) {
        alert("Please fill in all fields correctly before calculating.");
        return;
    }

    // Clear previous results
    document.getElementById("eulerResult").textContent = "";
    document.getElementById("eulerDetails").textContent = "";

    try {
        // Compute Euler's method
        const results = computeEulersMethod(equation, x0, y0, h, xg);

        // Display final result
        const lastResult = results[results.length - 1];
        document.getElementById("eulerResult").textContent = `The value of y(${lastResult.x.toFixed(2)}) is = ${lastResult.nextY.toFixed(4)}`;

        // Display detailed iterations
        const details = results.map(r => {
            return `x = ${r.x.toFixed(2)}, y = ${r.y.toFixed(4)}, Next y = ${r.nextY.toFixed(4)}`;
        }).join("\n\n");

        document.getElementById("eulerDetails").textContent = details;
    } catch (error) {
        alert("Invalid equation format. Please ensure the equation is correct.");
    }
}

function clearEulerResults() {
    document.getElementById("eulerResult").textContent = "";
    document.getElementById("eulerDetails").textContent = "";
}


//Milne Predictor and Corrector method
// Function to compute Milne's Predictor-Corrector Method with enhanced accuracy
function computeMilneMethod(equation, x0, y0, h, xg) {
    const results = [];
    const dydx = math.compile(equation);

    // Function to compute Runge-Kutta 4th order for a single step
    function rungeKuttaStep(x, y, h) {
        const k1 = dydx.evaluate({ x: x, y: y });
        const k2 = dydx.evaluate({ x: x + h / 2, y: y + (h / 2) * k1 });
        const k3 = dydx.evaluate({ x: x + h / 2, y: y + (h / 2) * k2 });
        const k4 = dydx.evaluate({ x: x + h, y: y + h * k3 });
        return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    }

    // Initialize values for first four points using Runge-Kutta method
    let currentX = x0;
    let currentY = y0;

    for (let i = 0; i < 4; i++) {
        results.push({ x: currentX, y: currentY });
        currentY = rungeKuttaStep(currentX, currentY, h);
        currentX += h;
    }

    // Apply Milne's Predictor-Corrector method for remaining steps
    while (currentX <= xg + 1e-10) {
        const n = results.length;

        // Predictor step
        const yPredictor = results[n - 4].y + (4 * h / 3) * (2 * dydx.evaluate({ x: results[n - 1].x, y: results[n - 1].y }) - 
                               dydx.evaluate({ x: results[n - 2].x, y: results[n - 2].y }) + 
                               2 * dydx.evaluate({ x: results[n - 3].x, y: results[n - 3].y }));

        // Corrector step
        const slopeCorrector = dydx.evaluate({ x: currentX, y: yPredictor });
        const yCorrector = results[n - 2].y + (h / 3) * (dydx.evaluate({ x: results[n - 3].x, y: results[n - 3].y }) + 
                              4 * slopeCorrector + 
                              dydx.evaluate({ x: results[n - 1].x, y: results[n - 1].y }));

        results.push({ x: currentX, y: yCorrector });
        currentX += h;
    }

    return results;
}

function calculateMilneMethod() {
    const equation = document.getElementById("milneEquation").value;
    const x0 = parseFloat(document.getElementById("milneX0").value);
    const y0 = parseFloat(document.getElementById("milneY0").value);
    const h = parseFloat(document.getElementById("milneH").value);
    const xg = parseFloat(document.getElementById("milneXg").value);

    // Check for empty inputs
    if (!equation || isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xg)) {
        alert("Please fill in all fields correctly before calculating.");
        return;
    }

    // Clear previous results
    document.getElementById("milneResult").textContent = "";
    document.getElementById("milneDetails").textContent = "";

    try {
        // Compute Milne's Predictor-Corrector Method
        const results = computeMilneMethod(equation, x0, y0, h, xg);

        // Display final result
        const lastResult = results[results.length - 1];
        document.getElementById("milneResult").textContent = `The value of y(${lastResult.x.toFixed(2)}) is = ${lastResult.y.toFixed(4)}`;

        // Display detailed iterations
        const details = results.map(r => {
            return `x = ${r.x.toFixed(2)}, y = ${r.y.toFixed(4)}`;
        }).join("\n\n");

        document.getElementById("milneDetails").textContent = details;
    } catch (error) {
        alert("Invalid equation format. Please ensure the equation is correct.");
    }
}

function clearMilneResults() {
    document.getElementById("milneResult").textContent = "";
    document.getElementById("milneDetails").textContent = "";
}

// Adam Bashforth method------------------------------------------
// Function to compute Adam-Bashforth Predictor-Corrector Method
function computeAdamBashforthMethod(equation, x0, y0, h, xg) {
    const results = [];
    const dydx = math.compile(equation);

    // Initialize values for the first four points using RK4
    let currentX = x0;
    let currentY = y0;

    for (let i = 0; i < 4; i++) {
        const k1 = h * dydx.evaluate({ x: currentX, y: currentY });
        const k2 = h * dydx.evaluate({ x: currentX + h / 2, y: currentY + k1 / 2 });
        const k3 = h * dydx.evaluate({ x: currentX + h / 2, y: currentY + k2 / 2 });
        const k4 = h * dydx.evaluate({ x: currentX + h, y: currentY + k3 });

        const nextY = currentY + (k1 + 2 * k2 + 2 * k3 + k4) / 6;

        results.push({ x: currentX, y: currentY });

        currentY = nextY;
        currentX += h;
    }

    // Apply Adam-Bashforth Predictor-Corrector method
    while (currentX <= xg) {
        const n = results.length;

        // Predictor step using 4th-order Adam-Bashforth
        const yPredictor = results[n - 1].y + h * (
            55 * dydx.evaluate({ x: results[n - 1].x, y: results[n - 1].y }) -
            59 * dydx.evaluate({ x: results[n - 2].x, y: results[n - 2].y }) +
            37 * dydx.evaluate({ x: results[n - 3].x, y: results[n - 3].y }) -
             9 * dydx.evaluate({ x: results[n - 4].x, y: results[n - 4].y })
        ) / 24;

        // Corrector step using 3rd-order Adam-Moulton
        const slopeCorrector = dydx.evaluate({ x: currentX, y: yPredictor });
        const yCorrector = results[n - 1].y + h * (
            9 * slopeCorrector +
            19 * dydx.evaluate({ x: results[n - 1].x, y: results[n - 1].y }) -
             5 * dydx.evaluate({ x: results[n - 2].x, y: results[n - 2].y }) +
             1 * dydx.evaluate({ x: results[n - 3].x, y: results[n - 3].y })
        ) / 24;

        results.push({ x: currentX, y: yCorrector });
        currentX += h;
    }

    return results;
}

function calculateAdamBashforthMethod() {
    const equation = document.getElementById("adamEquation").value;
    const x0 = parseFloat(document.getElementById("adamX0").value);
    const y0 = parseFloat(document.getElementById("adamY0").value);
    const h = parseFloat(document.getElementById("adamH").value);
    const xg = parseFloat(document.getElementById("adamXg").value);

    // Check for empty inputs
    if (!equation || isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xg)) {
        alert("Please fill in all fields correctly before calculating.");
        return;
    }

    // Clear previous results
    document.getElementById("adamResult").textContent = "";
    document.getElementById("adamDetails").textContent = "";

    try {
        // Compute Adam-Bashforth Predictor-Corrector Method
        const results = computeAdamBashforthMethod(equation, x0, y0, h, xg);

        // Display final result
        const lastResult = results[results.length - 1];
        document.getElementById("adamResult").textContent = `The value of y(${lastResult.x.toFixed(2)}) is = ${lastResult.y.toFixed(4)}`;

        // Display detailed iterations
        const details = results.map(r => {
            return `x = ${r.x.toFixed(2)}, y = ${r.y.toFixed(4)}`;
        }).join("\n\n");

        document.getElementById("adamDetails").textContent = details;
    } catch (error) {
        alert("Invalid equation format. Please ensure the equation is correct.");
    }
}

function clearAdamResults() {
    document.getElementById("adamResult").textContent = "";
    document.getElementById("adamDetails").textContent = "";
}



//RangeKutta
// Function to compute the first-order to fourth-order values
function computeRKValues(dydx, x0, y0, h, xg) {
    let results = [];
    while (x0 < xg) {
        let k1 = h * dydx(x0, y0);
        let k2 = h * dydx(x0 + h / 2, y0 + k1 / 2);
        let k3 = h * dydx(x0 + h / 2, y0 + k2 / 2);
        let k4 = h * dydx(x0 + h, y0 + k3);

        // Accurate calculation for y
        y0 += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        x0 += h;

        results.push({
            x: x0.toFixed(5),
            firstOrder: k1.toFixed(5),
            secondOrder: k2.toFixed(5),
            thirdOrder: k3.toFixed(5),
            fourthOrder: k4.toFixed(5),
            y: y0.toFixed(5)
        });
    }
    return results;
}

function calculateRK4() {
    const equation = document.getElementById("equation").value;
    const x0 = document.getElementById("x0").value;
    const y0 = document.getElementById("y0").value;
    const h = document.getElementById("h").value;
    const xg = document.getElementById("xg").value;

    // Check for empty inputs
    if (!equation || x0 === "" || y0 === "" || h === "" || xg === "") {
        alert("Please fill in all fields before calculating.");
        return;
    }

    const x0Num = parseFloat(x0);
    const y0Num = parseFloat(y0);
    const hNum = parseFloat(h);
    const xgNum = parseFloat(xg);

    try {
        // Convert the input equation into a function
        const dydx = math.compile(equation);

        // Helper function to evaluate dydx
        const evaluateDydx = (x, y) => dydx.evaluate({ x: x, y: y });

        // Compute the results using RK4
        const results = computeRKValues(evaluateDydx, x0Num, y0Num, hNum, xgNum);

        // Display the final accurate result and k values
        const lastResult = results[results.length - 1];
        document.getElementById("resultRange").textContent = `The value of y(${parseFloat(lastResult.x).toFixed(2)}) is = ${lastResult.y}`;

        // Display the first-order to fourth-order values for each iteration
        const details = results.map(r => {
            return `x = ${r.x}, y = ${r.y} `;
        }).join("\n\n");

        document.getElementById("detailsRange").textContent = details;
    } catch (error) {
        alert("Invalid equation format. Maybe try changing/interchanging the initial values of x and y OR double check the equation for its sign convention :)");
    }
}
