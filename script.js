document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const newNoteInput = document.getElementById('newNote');
    const addBtn = document.getElementById('addBtn');

    // Загрузка заметок из localStorage
    loadNotes();

    // Добавление новой заметки
    addBtn.addEventListener('click', () => {
        const noteText = newNoteInput.value.trim();
        if (noteText) {
            addNote(noteText);
            newNoteInput.value = '';
            saveNotes();
        }
    });

    // Добавление по Enter (с переносом строки по Shift+Enter)
    newNoteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addBtn.click();
        }
    });

    function addNote(text, isCompleted = false) {
        const noteId = Date.now().toString();
        const noteCard = document.createElement('div');
        noteCard.className = `note-card ${isCompleted ? 'completed' : ''}`;
        noteCard.dataset.id = noteId;
        
        noteCard.innerHTML = `
            <div class="note-text">${text}</div>
            <div class="note-actions">
                <button class="complete-btn">
                    <i class="fas fa-${isCompleted ? 'undo' : 'check'}"></i>
                    ${isCompleted ? 'Вернуть' : 'Завершить'}
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `;
        
        notesContainer.prepend(noteCard);
        
        // Добавляем обработчики событий
        noteCard.querySelector('.delete-btn').addEventListener('click', () => {
            noteCard.classList.add('deleting');
            setTimeout(() => {
                noteCard.remove();
                saveNotes();
            }, 400);
        });
        
        noteCard.querySelector('.complete-btn').addEventListener('click', () => {
            const isNowCompleted = !noteCard.classList.contains('completed');
            noteCard.classList.toggle('completed');
            noteCard.querySelector('.complete-btn').innerHTML = `
                <i class="fas fa-${isNowCompleted ? 'undo' : 'check'}"></i>
                ${isNowCompleted ? 'Вернуть' : 'Завершить'}
            `;
            saveNotes();
        });
    }

    function saveNotes() {
        const notes = [];
        document.querySelectorAll('.note-card').forEach(note => {
            notes.push({
                id: note.dataset.id,
                text: note.querySelector('.note-text').textContent,
                completed: note.classList.contains('completed')
            });
        });
        localStorage.setItem('instaNotes', JSON.stringify(notes));
    }

    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem('instaNotes')) || [];
        savedNotes.forEach(note => {
            addNote(note.text, note.completed);
        });
    }
});