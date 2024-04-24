function createLetterBoxes(word, attempts) {
    const container = document.getElementById('game2');

    container.innerHTML = '';

    for (let j = 0; j < attempts; j++) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'center';
        row.style.gap = '10px';

        for (let i = 0; i < word.length; i++) {
            const letterBox = document.createElement('input');
            letterBox.type = 'text';
            letterBox.maxLength = '1';
            letterBox.size = '1';
            letterBox.addEventListener('input', function() {
                if (i < word.length - 1) {
                    row.children[i + 1].focus();
                }
            });
            row.appendChild(letterBox);
        }

        container.appendChild(row);
    }
}

createLetterBoxes('Edgar', 6);