// 並べ替える要素のサイズは64
const SIZE = 64;
let count;

// Visualizerの画面を 64*600 に分割し、座標に応じたクラス名を付与する
if (typeof window === 'object') {
    const container = document.querySelector('.container');
    function createSquares() {
        const totalSquares = 64 * 600;
        for (let i = 0; i < totalSquares; i++) {
            const square = document.createElement('div');
            square.classList.add('square');

            const row = Math.floor(i / 600);
            const column = i % 600;
            square.classList.add(`row-${row}`);
            square.classList.add(`column-${column}`);

            container.appendChild(square);
        }
    }
    createSquares();
}

// 虹色の用意
const colors = [
    '#FF0000', '#FF1900', '#FF3200', '#FF4B00', '#FF6400', '#FF7D00', '#FF9600', '#FFAF00',
    '#FFC800', '#FFE100', '#FFFA00', '#E8FF00', '#D1FF00', '#BAFF00', '#A3FF00', '#8CFF00',
    '#75FF00', '#5EFF00', '#47FF00', '#30FF00', '#19FF00', '#00FF0F', '#00FF28', '#00FF41',
    '#00FF5A', '#00FF73', '#00FF8C', '#00FFA5', '#00FFBE', '#00FFD7', '#00FFF0', '#00F9FF',
    '#00E2FF', '#00CBFF', '#00B4FF', '#009DFF', '#0086FF', '#006FFF', '#0058FF', '#0041FF',
    '#002AFF', '#0013FF', '#0C00FF', '#2500FF', '#3E00FF', '#5700FF', '#7000FF', '#8900FF',
    '#A200FF', '#BB00FF', '#D400FF', '#ED00FF', '#FF00F8', '#FF00E1', '#FF00CA', '#FF00B3',
    '#FF009C', '#FF0085', '#FF006E', '#FF0057', '#FF0040', '#FF0029', '#FF0012', '#FF0000'
];

// ピクセルの色を塗る
function color(array, num) {
    for (let i = 0; i < SIZE - 1; i++) {
        const elements = document.querySelectorAll(`.column-${num}.row-${i}`);
        elements.forEach(element => {
            element.style.backgroundColor = array[i][1];
        });
    }
}

function swap_prep(array, a, b) {
    const tmp = array[a];
    array[a] = array[b];
    array[b] = tmp;
}

function swap(array, a, b) {
    const tmp = array[a];
    array[a] = array[b];
    array[b] = tmp;
    color(array, count++);
}

function bubbleSort(array) {
    for (let i = 0; i < SIZE - 1; i++) {
        for (let j = SIZE - 1; j > i; j--) {
            if (array[j - 1][0] > array[j][0]) {
                swap(array, j - 1, j);
            }
        }
    }
}

function selectionSort(array) {
    for (let i = 0; i < SIZE - 1; i++) {
        let minPos = i;
        for (let j = i + 1; j < SIZE; j++) {
            if (array[j][0] < array[minPos][0]) {
                minPos = j;
            }
        }
        swap(array, i, minPos);
    }
}

function insertionSort(array) {
    for (let i = 1; i < SIZE; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (array[j][0] <= array[j + 1][0]) break;
            swap(array, j, j + 1);
        }
    }
}

function shellSort(array) {
    let h = 1;
    while (h < SIZE) {
        h = 3 * h + 1;
    }
    while (h > 1) {
        h = Math.floor(h / 3);
        for (let i = h; i < SIZE; i++) {
            for (let j = i - h; j >= 0; j -= h) {
                if (array[j][0] > array[j + h][0]) {
                    swap(array, j, j + h);
                } else {
                    break;
                }
            }
        }
    }
}

function quick(array, left, right) {
    if (left >= right) {
        return;
    }

    const pivot = array[Math.floor((left + right) / 2)][0];
    let i = left;
    let j = right;
    do {
        while (array[i][0] < pivot) {
            i++;
        }
        while (array[j][0] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(array, i, j);
            i++;
            j--;
        }
    } while (i <= j);
    quick(array, left, j);
    quick(array, i, right);
}

function quickSort(array) {
    quick(array, 0, SIZE - 1);
}

function downHeap(array, k, r) {
    const v = array[k][0];
    while (true) {
        let j = k + k + 1;
        if (j > r) {
            break;
        }
        if (j !== r && array[j + 1][0] > array[j][0]) {
            j++;
        }
        if (v >= array[j][0]) {
            break;
        }
        swap(array, k, j);
        k = j;
    }
    array[k][0] = v;
}

function heapSort(array) {
    for (let i = SIZE - 1; i >= 0; i--) {
        downHeap(array, i, SIZE - 1);
    }
    for (let i = SIZE - 1; i > 0; i--) {
        swap(array, 0, i);
        downHeap(array, 0, i - 1);
    }
}

let merge_count = 0;
function merge(from, into, length, flag) {
    let start = 0;
    while (start < SIZE) {
        let i = start;
        let j = start + length;
        let k = start;
        let iEnd = Math.min(start + length, SIZE);
        let jEnd = Math.min(start + length + length, SIZE);
        while (i < iEnd && j < jEnd) {
            if (from[i][0] <= from[j][0]) {
                into[k++] = from[i++];
            } else {
                into[k++] = from[j++];
            }
            if (flag == 1) {
                color(from, merge_count++);
            } else {
                color(into, merge_count++);
            }
        }
        while (i < iEnd) {
            into[k++] = from[i++];
        }
        while (j < jEnd) {
            into[k++] = from[j++];
        }
        start += length + length;
    }
}

function mergeSort(array) {
    const b = new Array(SIZE);
    let length = 1;
    while (length < SIZE) {
        merge(array, b, length, 1);
        merge(b, array, 2 * length, 2);
        length *= 4;
    }
}

function shuffle(array, length) {
    let i = length;
    while (i > 1) {
        const j = Math.floor(Math.random() * i--);
        swap_prep(array, i, j);
    }
}

// 新しい配列の生成
const array = new Array(SIZE);
for (let i = 0; i < SIZE; i++) {
    array[i] = i;
}

// ボタンを押したら関数を実行
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', runSortAlgorithm);

function runSortAlgorithm() {
    var selectBox = document.getElementById('sort-algorithm');
    var selectedValue = selectBox.value;

    // 整数と色の組み合わせの2次元配列
    const coloredArray = array.map(i => [i, colors[i]]);
    shuffle(coloredArray, SIZE);
    count = 0;

    if (selectedValue === 'bubbleSort') {
        bubbleSort(coloredArray);
    } else if (selectedValue === 'selectionSort') {
        selectionSort(coloredArray);
    } else if (selectedValue === 'insertionSort') {
        insertionSort(coloredArray);
    } else if (selectedValue === 'shellSort') {
        shellSort(coloredArray);
    } else if (selectedValue === 'quickSort') {
        quickSort(coloredArray);
    } else if (selectedValue === 'heapSort') {
        heapSort(coloredArray);
    } else if (selectedValue === 'mergeSort') {
        mergeSort(coloredArray);
    }
}