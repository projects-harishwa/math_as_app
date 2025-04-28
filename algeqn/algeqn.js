//Fixed point iteration
function solveFixedPoint() {
    try {
        const expression = document.getElementById('functionfixed').value;
        const decimalPlaces = parseInt(document.getElementById('decimalPlaces').value);
        const tolerance = Math.pow(10, -decimalPlaces);
        const maxIterations = 1000;

        const node = math.parse(expression);
        const expr = node.compile();
        const derivativeNode = math.derivative(node, 'x');
        const derivativeExpr = derivativeNode.compile();

        const func = x => expr.evaluate({ x: x, e: Math.E });
        const funcDerivative = x => derivativeExpr.evaluate({ x: x, e: Math.E });

        let x0 = 0; // Initial guess
        for (let i = 0; i < maxIterations; i++) {
            let fx0 = func(x0);
            if (Math.abs(fx0) < tolerance) {
                document.getElementById('fixedresult').innerText = `Root: ${parseFloat(x0.toFixed(decimalPlaces))}`;
                return;
            }
            let fprimeX0 = funcDerivative(x0);
            if (fprimeX0 === 0) {
                document.getElementById('fixedresult').innerText = "Derivative is zero. Method failed.";
                return;
            }
            let x1 = x0 - fx0 / fprimeX0;
            if (Math.abs(x1 - x0) < tolerance) {
                document.getElementById('fixedresult').innerText = `Root: ${parseFloat(x1.toFixed(decimalPlaces))}`;
                return;
            }
            x0 = x1;
        }

        document.getElementById('fixedresult').innerText = "Method did not converge within the maximum iterations.";
    } catch (error) {
document.getElementById('fixedresult').innerText = "Sorry, wrong usage, double-check your equation.";
    }
}




//Newton
// Disable right-click
document.oncontextmenu = () => false;

// Function to get sign of a number
function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

// Newton-Raphson Method
function newtonRaphsonMethod(func, funcDerivative, initialGuess, decimalPlaces, tolerance = 1e-6, maxIterations = 1000) {
    let x0 = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
        const fx0 = func(x0);
        if (Math.abs(fx0) < tolerance) {
            return parseFloat(x0.toFixed(decimalPlaces));
        }
        const fprimeX0 = funcDerivative(x0);
        if (fprimeX0 === 0) {
            console.error("Derivative is zero. Newton-Raphson method failed.");
            return null;
        }
        const x1 = x0 - fx0 / fprimeX0;
        if (Math.abs(x1 - x0) < tolerance) {
            return parseFloat(x1.toFixed(decimalPlaces));
        }
        x0 = x1;
    }
    console.error("Newton-Raphson method did not converge within the maximum number of iterations.");
    return null;
}

// Main function triggered on button click
function calculateRoot() {
    const expressionInput = document.getElementById('expression').value.trim();
    const decimalInput = parseInt(document.getElementById('decimal').value.trim(), 10);

    if (!expressionInput || isNaN(decimalInput)) {
        document.getElementById('result').innerText = "Please enter both function and decimal places.";
        return;
    }

    const tolerance = Math.pow(10, -decimalInput);
    const maxIterations = 1000;

    let node;
    try {
        node = math.parse(expressionInput);
    } catch (error) {
        document.getElementById('result').innerText = "Invalid function format.";
        return;
    }

    const expr = node.compile();
    const derivativeNode = math.derivative(node, 'x');
    const derivativeExpr = derivativeNode.compile();

    const func = x => expr.evaluate({ x: x, e: Math.E });
    const funcDerivative = x => derivativeExpr.evaluate({ x: x, e: Math.E });

    const start = 0;
    const end = 10;
    const step = 0.1;
    let prevX = null;
    let prevSign = null;
    const midpoints = [];

    for (let x = start; x <= end; x += step) {
        const currentValue = func(x);
        const currentSign = sign(currentValue);

        if (prevSign !== null && prevSign !== currentSign) {
            if (prevX !== null) {
                const midpoint = (prevX + x) / 2;
                midpoints.push(midpoint);
            }
        }

        prevX = x;
        prevSign = currentSign;
    }

    if (midpoints.length === 0) {
        document.getElementById('result').innerText = "No root found within the given range.";
        return;
    }

    for (const midpoint of midpoints) {
        const root = newtonRaphsonMethod(func, funcDerivative, midpoint, decimalInput, tolerance, maxIterations);
        if (root !== null && root >= 0) {
            document.getElementById('result').innerText = `Root found: ${root}`;
            return;
        }
    }

    document.getElementById('result').innerText = "Newton-Raphson method did not converge or derivative is zero.";
}
