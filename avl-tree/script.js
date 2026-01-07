let root = null;
let lastRotation = null;
let rotatedNodes = [];

// -------- Tree Node --------
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// -------- INSERT --------
function insertNode() {
    const input = document.getElementById("nodeValue");
    const value = parseInt(input.value);

    if (isNaN(value)) {
        alert("Please enter a valid number");
        return;
    }

    lastRotation = null;
    rotatedNodes = [];

    root = insertAVL(root, value);
    input.value = "";
    renderTree();
}

function insertAVL(node, value) {
    if (!node) return new TreeNode(value);

    if (value < node.value) node.left = insertAVL(node.left, value);
    else if (value > node.value) node.right = insertAVL(node.right, value);
    else return node;

    return rebalance(node);
}

// -------- DELETE --------
function deleteNode() {
    const input = document.getElementById("nodeValue");
    const value = parseInt(input.value);

    if (isNaN(value)) {
        alert("Please enter a value to delete");
        return;
    }

    lastRotation = null;
    rotatedNodes = [];

    root = deleteAVL(root, value);
    input.value = "";
    renderTree();
}

function deleteAVL(node, value) {
    if (!node) return node;

    if (value < node.value) {
        node.left = deleteAVL(node.left, value);
    } else if (value > node.value) {
        node.right = deleteAVL(node.right, value);
    } else {
        // Node with one or no child
        if (!node.left || !node.right) {
            node = node.left || node.right;
        } else {
            // Node with two children
            const successor = getMinValueNode(node.right);
            node.value = successor.value;
            node.right = deleteAVL(node.right, successor.value);
        }
    }

    if (!node) return node;
    return rebalance(node);
}

// -------- REBALANCE --------
function rebalance(node) {
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    const balance = getBalance(node);

    // LL
    if (balance > 1 && getBalance(node.left) >= 0) {
        lastRotation = "LL Rotation";
        rotatedNodes = [node.value, node.left.value];
        return rightRotate(node);
    }

    // LR
    if (balance > 1 && getBalance(node.left) < 0) {
        lastRotation = "LR Rotation";
        rotatedNodes = [node.value, node.left.value];
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RR
    if (balance < -1 && getBalance(node.right) <= 0) {
        lastRotation = "RR Rotation";
        rotatedNodes = [node.value, node.right.value];
        return leftRotate(node);
    }

    // RL
    if (balance < -1 && getBalance(node.right) > 0) {
        lastRotation = "RL Rotation";
        rotatedNodes = [node.value, node.right.value];
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// -------- ROTATIONS --------
function rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));

    return x;
}

function leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));

    return y;
}

// -------- HELPERS --------
function getHeight(node) {
    return node ? node.height : 0;
}

function getBalance(node) {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function getMinValueNode(node) {
    while (node.left) node = node.left;
    return node;
}

// -------- RESET --------
function resetTree() {
    root = null;
    lastRotation = null;
    rotatedNodes = [];

    document.getElementById("treeLines").innerHTML = "";
    document.querySelectorAll(".tree-node").forEach(n => n.remove());
    document.getElementById("rotationInfo").innerText = "";
}

// -------- RENDER --------
function renderTree() {
    const canvas = document.getElementById("treeCanvas");
    const svg = document.getElementById("treeLines");

    canvas.querySelectorAll(".tree-node").forEach(n => n.remove());
    svg.innerHTML = "";

    document.getElementById("rotationInfo").innerText =
        lastRotation ? `🔄 ${lastRotation} performed` : "";

    if (!root) return;

    drawNode(canvas, svg, root, canvas.clientWidth / 2, 40, 180);
}

function drawNode(container, svg, node, x, y, offset) {
    if (!node) return;

    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";
    nodeDiv.style.left = `${x - 20}px`;
    nodeDiv.style.top = `${y - 20}px`;
    nodeDiv.innerText = node.value;

    if (rotatedNodes.includes(node.value)) {
        nodeDiv.classList.add("highlight");
    }

    container.appendChild(nodeDiv);

    if (node.left) {
        drawLine(svg, x, y, x - offset, y + 80);
        drawNode(container, svg, node.left, x - offset, y + 80, offset / 1.7);
    }

    if (node.right) {
        drawLine(svg, x, y, x + offset, y + 80);
        drawNode(container, svg, node.right, x + offset, y + 80, offset / 1.7);
    }
}

function drawLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#555");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
}
