//Trapezoidal-------------------------------------------------------------------------------
function trapezoidalDoubleIntegral(func, xLower, xUpper, yLower, yUpper, xSteps = 50, ySteps = 50) {
    const deltaX = (xUpper - xLower) / xSteps;
    const deltaY = (yUpper - yLower) / ySteps;
    let integral = 0;

    for (let i = 0; i <= xSteps; i++) {
        const x = xLower + i * deltaX;
        for (let j = 0; j <= ySteps; j++) {
            const y = yLower + j * deltaY;
            const weight =
                (i === 0 || i === xSteps ? 1 : 2) *
                (j === 0 || j === ySteps ? 1 : 2);
            integral += weight * func(x, y);
        }
    }

    integral *= (deltaX * deltaY) / 4;
    return integral;
}

function parseFunction(input) {
    // Replace ^ with ** for exponentiation
    input = input.replace(/\^/g, '**');
    
    // Handle powers in parentheses like (1/2)
    input = input.replace(/\(([^()]+)\)/g, (_, content) => `(${content})`);
    
    // Replace sqrt with Math.sqrt
    input = input.replace(/\bsqrt\b/g, 'Math.sqrt');
    
    // Replace trigonometric functions and other Math functions
    const mathFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'];
    mathFunctions.forEach(fn => {
        const regex = new RegExp(`\\b${fn}\\(([^)]+)\\)`, 'g');
        input = input.replace(regex, `Math.${fn}($1)`);
    });

    return input;
}

function parseExpression(input) {
    // Replace "pi" with "Math.PI"
    input = input.replace(/pi/gi, "Math.PI");
    return Function(`return (${input});`)();
}

function calculateIntegral() {
    const funcInput = document.getElementById("functionInput").value;
    const xLowerInput = document.getElementById("xLower").value;
    const xUpperInput = document.getElementById("xUpper").value;
    const yLowerInput = document.getElementById("yLower").value;
    const yUpperInput = document.getElementById("yUpper").value;

    const hValueInput = document.getElementById("hValue").value || "1"; // Default to 1
    const kValueInput = document.getElementById("kValue").value || "1"; // Default to 1

    try {
        // Parse limits
        const xLower = parseExpression(xLowerInput);
        const xUpper = parseExpression(xUpperInput);
        const yLower = parseExpression(yLowerInput);
        const yUpper = parseExpression(yUpperInput);

        // Parse h and k values
        const hValue = parseExpression(hValueInput);
        const kValue = parseExpression(kValueInput);

        // Replace variables h and k in the function
        let parsedFunction = parseFunction(funcInput);
        parsedFunction = parsedFunction.replace(/\bh\b/g, hValue);
        parsedFunction = parsedFunction.replace(/\bk\b/g, kValue);

        // Create function
        const func = new Function("x", "y", `return ${parsedFunction};`);
        const result = trapezoidalDoubleIntegral(func, xLower, xUpper, yLower, yUpper);
        document.getElementById("result_trap").textContent = `Result: ${result.toFixed(4)}`;
    } catch (error) {
        document.getElementById("result_trap").textContent = "Incomplete input. Please check your entries.";
        console.error(error);
    }
}


//Simpson double integral-----------------------------
function simpsonsDoubleIntegral(func, xLower, xUpper, yLower, yUpper, xSteps = 50, ySteps = 50) {
    if (xSteps % 2 !== 0) xSteps++; // Ensure even steps for Simpson's rule
    if (ySteps % 2 !== 0) ySteps++; // Ensure even steps for Simpson's rule

    const deltaX = (xUpper - xLower) / xSteps;
    const deltaY = (yUpper - yLower) / ySteps;
    let integral = 0;

    for (let i = 0; i <= xSteps; i++) {
        const x = xLower + i * deltaX;
        for (let j = 0; j <= ySteps; j++) {
            const y = yLower + j * deltaY;

            // Determine the weight for Simpson's Rule
            const weightX = (i === 0 || i === xSteps ? 1 : (i % 2 === 0 ? 2 : 4));
            const weightY = (j === 0 || j === ySteps ? 1 : (j % 2 === 0 ? 2 : 4));
            integral += weightX * weightY * func(x, y);
        }
    }

    integral *= (deltaX * deltaY) / 9;
    return integral;
}

function parseSimpsonFunction(input) {
    // Replace ^ with ** for exponentiation
    input = input.replace(/\^/g, '**');
    
    // Handle powers in parentheses like (1/2)
    input = input.replace(/\(([^()]+)\)/g, (_, content) => `(${content})`);
    
    // Replace sqrt with Math.sqrt
    input = input.replace(/\bsqrt\b/g, 'Math.sqrt');
    
    // Replace trigonometric functions and other Math functions
    const mathFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'];
    mathFunctions.forEach(fn => {
        const regex = new RegExp(`\\b${fn}\\(([^)]+)\\)`, 'g');
        input = input.replace(regex, `Math.${fn}($1)`);
    });

    return input;
}

function parseSimpsonExpression(input) {
    // Replace "pi" with "Math.PI"
    input = input.replace(/pi/gi, "Math.PI");
    return Function(`return (${input});`)();
}

function calculateSimpsonIntegral() {
    const funcInput = document.getElementById("simpsonFunctionInput").value;
    const xLowerInput = document.getElementById("simpsonXLower").value;
    const xUpperInput = document.getElementById("simpsonXUpper").value;
    const yLowerInput = document.getElementById("simpsonYLower").value;
    const yUpperInput = document.getElementById("simpsonYUpper").value;

    const hValueInput = document.getElementById("simpsonHValue").value || "1"; // Default to 1
    const kValueInput = document.getElementById("simpsonKValue").value || "1"; // Default to 1

    try {
        // Parse limits
        const xLower = parseSimpsonExpression(xLowerInput);
        const xUpper = parseSimpsonExpression(xUpperInput);
        const yLower = parseSimpsonExpression(yLowerInput);
        const yUpper = parseSimpsonExpression(yUpperInput);

        // Parse h and k values
        const hValue = parseSimpsonExpression(hValueInput);
        const kValue = parseSimpsonExpression(kValueInput);

        // Replace variables h and k in the function
        let parsedFunction = parseSimpsonFunction(funcInput);
        parsedFunction = parsedFunction.replace(/\bh\b/g, hValue);
        parsedFunction = parsedFunction.replace(/\bk\b/g, kValue);

        // Create function
        const func = new Function("x", "y", `return ${parsedFunction};`);
        const result = simpsonsDoubleIntegral(func, xLower, xUpper, yLower, yUpper);
        document.getElementById("simpsonResult").textContent = `Result: ${result.toFixed(4)}`;
    } catch (error) {
        document.getElementById("simpsonResult").textContent = "Incomplete input. Please check your entries.";
        console.error(error);
    }
}

//Trapezoidal single integration----------------------------------------
function trapezoidalSingleIntegral(func, xLower, xUpper, steps = 50) {
    const deltaX = (xUpper - xLower) / steps;
    let integral = 0;

    for (let i = 0; i <= steps; i++) {
        const x = xLower + i * deltaX;
        const weight = (i === 0 || i === steps) ? 1 : 2; // Trapezoidal weights
        integral += weight * func(x);
    }

    integral *= deltaX / 2;
    return integral;
}

function parseFunction(input) {
    // Replace ^ with ** for exponentiation
    input = input.replace(/\^/g, '**');
    
    // Handle powers in parentheses like (1/2)
    input = input.replace(/\(([^()]+)\)/g, (_, content) => `(${content})`);
    
    // Replace sqrt with Math.sqrt
    input = input.replace(/\bsqrt\b/g, 'Math.sqrt');
    
    // Replace e^ with Math.E**
    input = input.replace(/\be\^\(([^)]+)\)/g, 'Math.E**($1)');
    input = input.replace(/\be\^([^()]+)/g, 'Math.E**($1)');
    
    // Replace trigonometric functions and other Math functions
    const mathFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'];
    mathFunctions.forEach(fn => {
        const regex = new RegExp(`\\b${fn}\\(([^)]+)\\)`, 'g');
        input = input.replace(regex, `Math.${fn}($1)`);
    });

    return input;
}

function parseExpression(input) {
    // Replace "pi" with "Math.PI"
    input = input.replace(/pi/gi, "Math.PI");
    return Function(`return (${input});`)();
}

function calculateTrapezoidal() {
    const funcInput = document.getElementById("singleFunction").value;
    const xLowerInput = document.getElementById("singleLowerX").value;
    const xUpperInput = document.getElementById("singleUpperX").value;
    const vValueInput = document.getElementById("singleVValue").value || "1"; // Default to 1

    try {
        // Parse limits
        const xLower = parseExpression(xLowerInput);
        const xUpper = parseExpression(xUpperInput);

        // Parse v value
        const vValue = parseExpression(vValueInput);

        // Replace variable v in the function
        let parsedFunction = parseFunction(funcInput);
        parsedFunction = parsedFunction.replace(/\bv\b/g, vValue);

        // Create function
        const func = new Function("x", `return ${parsedFunction};`);
        const result = trapezoidalSingleIntegral(func, xLower, xUpper);
        document.getElementById("singleResult").textContent = `Result: ${result.toFixed(4)}`;
    } catch (error) {
        document.getElementById("singleResult").textContent = "Incomplete input. Please check your entries.";
        console.error(error);
    }
}

//Simpson single integral

function simpsonSingleIntegral(func, xLower, xUpper, steps = 50) {
    if (steps % 2 !== 0) steps += 1; // Ensure an even number of steps for Simpson's rule
    const deltaX = (xUpper - xLower) / steps;
    let integral = 0;

    for (let i = 0; i <= steps; i++) {
        const x = xLower + i * deltaX;
        let weight;
        if (i === 0 || i === steps) {
            weight = 1; // Endpoints
        } else if (i % 2 === 0) {
            weight = 2; // Even indices
        } else {
            weight = 4; // Odd indices
        }
        integral += weight * func(x);
    }

    integral *= deltaX / 3;
    return integral;
}

function parseSimpsonFunction(input) {
// Replace ^ with ** for exponentiation
input = input.replace(/\^/g, '**');

// Handle powers in parentheses like (1/2)
input = input.replace(/\(([^()]+)\)/g, (_, content) => `(${content})`);

// Replace sqrt with Math.sqrt
input = input.replace(/\bsqrt\b/g, 'Math.sqrt');

// Replace e^ with Math.E**
input = input.replace(/\be\^\(([^)]+)\)/g, 'Math.E**($1)'); // For e^(expression)
input = input.replace(/\be\^([^()]+)/g, 'Math.E**($1)');    // For e^number or e^variable

// Replace trigonometric functions and other Math functions
const mathFunctions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'];
mathFunctions.forEach(fn => {
const regex = new RegExp(`\\b${fn}\\(([^)]+)\\)`, 'g');
input = input.replace(regex, `Math.${fn}($1)`);
});

return input;
}
function parseSimpsonExpression(input) {
    // Replace "pi" with "Math.PI"
    input = input.replace(/pi/gi, "Math.PI");
    return Function(`return (${input});`)();
}

function calculateSimpson() {
    const funcInput = document.getElementById("simpsonFunction").value;
    const xLowerInput = document.getElementById("simpsonLowerX").value;
    const xUpperInput = document.getElementById("simpsonUpperX").value;
    const vValueInput = document.getElementById("simpsonVValue").value || "1"; // Default to 1

    try {
        // Parse limits
        const xLower = parseSimpsonExpression(xLowerInput);
        const xUpper = parseSimpsonExpression(xUpperInput);

        // Parse v value
        const vValue = parseSimpsonExpression(vValueInput);

        // Replace variable v in the function
        let parsedFunction = parseSimpsonFunction(funcInput);
        parsedFunction = parsedFunction.replace(/\bv\b/g, vValue);

        // Create function
        const func = new Function("x", `return ${parsedFunction};`);
        const result_simp_single = simpsonSingleIntegral(func, xLower, xUpper);
        document.getElementById("simpsonsingleResult").textContent = `Result: ${result_simp_single.toFixed(4)}`;
    } catch (error) {
        document.getElementById("simpsonsingleResult").textContent = "Incomplete input. Please check your entries.";
        console.error(error);
    }
}
