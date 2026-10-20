import { searchData } from './search.js';

export const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    const suggestionsContainer = e.target.closest('.search-container') || e.target.closest('.mobile-search-field')?.parentElement;
    if (!suggestionsContainer) return;

    const list = suggestionsContainer.querySelector('.search-suggestions ul');
    if (!list) return;

    if (!query) {
        const defaults = searchData.slice(0, 4);
        renderSuggestions(list, defaults, suggestionsContainer);
        return;
    }

    const filtered = searchData.filter(item => 
        item.label.toLowerCase().includes(query)
    );

    renderSuggestions(list, filtered, suggestionsContainer);
};

const renderSuggestions = (list, items, container) => {
    const fragment = document.createDocumentFragment();
    if (items.length === 0) {
        const li = document.createElement('li');
        li.className = 'search-no-results';
        li.textContent = 'No results found';
        fragment.appendChild(li);
    } else {
        items.forEach((item) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.label;
            li.appendChild(a);
            fragment.appendChild(li);
        });
    }

    list.replaceChildren(fragment);
    const status = container.querySelector('.search-results-status');
    if (status) {
        status.textContent = items.length
            ? `${items.length} ${items.length === 1 ? 'result' : 'results'} found`
            : 'No results found';
    }
};
