// Traducciones
const translations = {
    en: {
        appTitle: 'MD Reader - Markdown Reader',
        index: 'Index',
        settings: 'Settings',
        theme: 'Theme:',
        font: 'Font:',
        size: 'Size:',
        width: 'Width:',
        view: 'View:',
        light: 'Light',
        dark: 'Dark',
        sepia: 'Sepia',
        gray: 'Gray',
        contrast: 'Contrast',
        continuous: 'Continuous',
        paged: 'Paged',
        dropFile: 'Drag your Markdown file here',
        or: 'or',
        selectFile: 'Select file',
        previous: '← Previous',
        next: 'Next →',
        pageInfo: 'Page {current} of {total}',
        loadFileForIndex: 'Load a file to see the index',
        closeSidebar: 'Close sidebar',
        closeSettings: 'Close settings panel',
        noHeadings: 'No headings in the document',
        invalidFile: 'Please select a Markdown file (.md or .markdown)',
        invalidFileDrag: 'Please drag a Markdown file (.md or .markdown)'
    },
    es: {
        appTitle: 'MD Reader - Lector de Markdown',
        index: 'Índice',
        settings: 'Configuración',
        theme: 'Tema:',
        font: 'Fuente:',
        size: 'Tamaño:',
        width: 'Ancho:',
        view: 'Vista:',
        light: 'Light',
        dark: 'Dark',
        sepia: 'Sepia',
        gray: 'Gray',
        contrast: 'Contrast',
        continuous: 'Continuo',
        paged: 'Paginado',
        dropFile: 'Arrastra tu archivo Markdown aquí',
        or: 'o',
        selectFile: 'Seleccionar archivo',
        previous: '← Anterior',
        next: 'Siguiente →',
        pageInfo: 'Página {current} de {total}',
        loadFileForIndex: 'Carga un archivo para ver el índice',
        closeSidebar: 'Cerrar barra lateral',
        closeSettings: 'Cerrar panel de controles',
        noHeadings: 'No hay encabezados en el documento',
        invalidFile: 'Por favor, selecciona un archivo Markdown (.md o .markdown)',
        invalidFileDrag: 'Por favor, arrastra un archivo Markdown (.md o .markdown)'
    },
    gl: {
        appTitle: 'MD Reader - Lector de Markdown',
        index: 'Índice',
        settings: 'Configuración',
        theme: 'Tema:',
        font: 'Fonte:',
        size: 'Tamaño:',
        width: 'Ancho:',
        view: 'Vista:',
        light: 'Light',
        dark: 'Dark',
        sepia: 'Sepia',
        gray: 'Gray',
        contrast: 'Contrast',
        continuous: 'Continuo',
        paged: 'Paxinado',
        dropFile: 'Arrastra o teu ficheiro Markdown aquí',
        or: 'ou',
        selectFile: 'Seleccionar ficheiro',
        previous: '← Anterior',
        next: 'Seguinte →',
        pageInfo: 'Páxina {current} de {total}',
        loadFileForIndex: 'Carga un ficheiro para ver o índice',
        closeSidebar: 'Pechar barra lateral',
        closeSettings: 'Pechar panel de controis',
        noHeadings: 'Non hai encabezados no documento',
        invalidFile: 'Por favor, selecciona un ficheiro Markdown (.md ou .markdown)',
        invalidFileDrag: 'Por favor, arrastra un ficheiro Markdown (.md ou .markdown)'
    }
};

// Estado de la aplicación
const state = {
    currentFile: null,
    markdownContent: '',
    htmlContent: '',
    frontmatter: null,
    currentLanguage: 'en',
    currentTheme: 'light',
    currentFont: 'Inter',
    fontSize: 16,
    width: 70,
    viewMode: 'continuous',
    currentPage: 0,
    totalPages: 1,
    outline: []
};

// Elementos del DOM
const elements = {
    fileDropArea: document.getElementById('fileDropArea'),
    fileInput: document.getElementById('fileInput'),
    fileSelectBtn: document.getElementById('fileSelectBtn'),
    viewerContainer: document.getElementById('viewerContainer'),
    viewer: document.getElementById('viewer'),
    sidebar: document.getElementById('sidebar'),
    toggleSidebar: document.getElementById('toggleSidebar'),
    showSidebarBtn: document.getElementById('showSidebarBtn'),
    controlsPanel: document.getElementById('controlsPanel'),
    showControlsBtn: document.getElementById('showControlsBtn'),
    closeControlsBtn: document.getElementById('closeControlsBtn'),
    outline: document.getElementById('outline'),
    themeSelect: document.getElementById('themeSelect'),
    fontSelect: document.getElementById('fontSelect'),
    fontSizeSelect: document.getElementById('fontSizeSelect'),
    fontSizeValue: document.getElementById('fontSizeValue'),
    widthSelect: document.getElementById('widthSelect'),
    widthValue: document.getElementById('widthValue'),
    viewModeSelect: document.getElementById('viewModeSelect'),
    paginationControls: document.getElementById('paginationControls'),
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    pageInfo: document.getElementById('pageInfo'),
    langButtons: document.querySelectorAll('.lang-btn')
};

// Configurar marked.js
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// Inicialización
function init() {
    setupEventListeners();
    loadSettings();
    loadLanguage();
    applySettings();
    initSidebarState();
    updateLanguage();
}

// Configurar event listeners
function setupEventListeners() {
    // Selector de idioma
    elements.langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Carga de archivo
    elements.fileSelectBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    elements.fileDropArea.addEventListener('dragover', handleDragOver);
    elements.fileDropArea.addEventListener('dragleave', handleDragLeave);
    elements.fileDropArea.addEventListener('drop', handleDrop);
    
    // Controles
    elements.themeSelect.addEventListener('change', (e) => {
        state.currentTheme = e.target.value;
        applyTheme();
        saveSettings();
    });
    
    elements.fontSelect.addEventListener('change', (e) => {
        state.currentFont = e.target.value;
        applyFont();
        saveSettings();
    });
    
    elements.fontSizeSelect.addEventListener('input', (e) => {
        state.fontSize = parseInt(e.target.value);
        elements.fontSizeValue.textContent = `${state.fontSize}px`;
        applyFontSize();
        saveSettings();
    });
    
    elements.widthSelect.addEventListener('input', (e) => {
        state.width = parseInt(e.target.value);
        elements.widthValue.textContent = `${state.width}%`;
        applyWidth();
        saveSettings();
    });
    
    elements.viewModeSelect.addEventListener('change', (e) => {
        state.viewMode = e.target.value;
        applyViewMode();
        saveSettings();
    });
    
    // Sidebar
    elements.toggleSidebar.addEventListener('click', toggleSidebar);
    elements.showSidebarBtn.addEventListener('click', () => {
        elements.sidebar.classList.remove('hidden');
        updateSidebarButtonVisibility();
    });
    
    // Panel de controles
    elements.showControlsBtn.addEventListener('click', () => {
        elements.controlsPanel.classList.remove('hidden');
        updateControlsButtonVisibility();
    });
    elements.closeControlsBtn.addEventListener('click', toggleControlsPanel);
    
    // Paginación
    elements.prevPageBtn.addEventListener('click', () => navigatePage(-1));
    elements.nextPageBtn.addEventListener('click', () => navigatePage(1));
    
    // Scroll para actualizar outline activo
    elements.viewer.addEventListener('scroll', updateActiveOutline);
    
    // Scroll para actualizar opacidad de botones - usar throttling para mejor rendimiento
    let scrollTimeout;
    const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateButtonsOpacity, 10);
    };
    
    elements.viewer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // También escuchar scroll en el main-content y viewerContainer
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.addEventListener('scroll', handleScroll, { passive: true });
    }
    if (elements.viewerContainer) {
        elements.viewerContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Recalcular páginas cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (state.viewMode === 'paged' && state.markdownContent) {
            calculatePages();
        }
    });
    
    // Cerrar barras laterales al hacer clic fuera de ellas
    document.addEventListener('click', (e) => {
        // Verificar si el clic fue fuera de las barras laterales
        const sidebar = elements.sidebar;
        const controlsPanel = elements.controlsPanel;
        const showSidebarBtn = elements.showSidebarBtn;
        const showControlsBtn = elements.showControlsBtn;
        
        // Verificar si el clic fue en algún botón de toggle (no cerrar en ese caso)
        const clickedOnToggle = e.target === showSidebarBtn || 
                                e.target === showControlsBtn ||
                                showSidebarBtn.contains(e.target) ||
                                showControlsBtn.contains(e.target);
        
        // Verificar si el clic fue dentro de las barras laterales
        const clickedInSidebar = sidebar && !sidebar.classList.contains('hidden') && 
                                 (sidebar.contains(e.target) || sidebar === e.target);
        const clickedInControls = controlsPanel && !controlsPanel.classList.contains('hidden') && 
                                  (controlsPanel.contains(e.target) || controlsPanel === e.target);
        
        // Si el clic fue fuera de las barras y no en los botones de toggle, cerrar las barras abiertas
        if (!clickedOnToggle && !clickedInSidebar && !clickedInControls) {
            // Cerrar sidebar si está abierto
            if (sidebar && !sidebar.classList.contains('hidden')) {
                toggleSidebar();
            }
            // Cerrar panel de controles si está abierto
            if (controlsPanel && !controlsPanel.classList.contains('hidden')) {
                toggleControlsPanel();
            }
        }
    });
}

// Manejo de archivos
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'text/markdown' || file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
        loadFile(file);
    } else {
        alert(translations[state.currentLanguage].invalidFile);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.querySelector('.drop-zone').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.querySelector('.drop-zone').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.querySelector('.drop-zone').classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.markdown'))) {
        loadFile(file);
    } else {
        alert(translations[state.currentLanguage].invalidFileDrag);
    }
}

function loadFile(file) {
    state.currentFile = file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        // Parsear frontmatter YAML
        const parsed = parseFrontmatter(content);
        // Eliminar comandos LaTeX
        const cleanedContent = removeLatexCommands(parsed.content);
        state.markdownContent = cleanedContent;
        state.frontmatter = parsed.frontmatter;
        renderMarkdown();
        generateOutline();
        elements.fileDropArea.style.display = 'none';
        elements.viewerContainer.style.display = 'flex';
        
        // Ocultar selector de idioma y footer de licencia cuando se carga un archivo
        const langSelector = document.querySelector('.language-selector');
        if (langSelector) {
            langSelector.style.display = 'none';
        }
        const licenseFooter = document.querySelector('.license-footer');
        if (licenseFooter) {
            licenseFooter.style.display = 'none';
        }
        
        // Aplicar configuración después de renderizar
        setTimeout(() => {
            applySettings();
        }, 100);
    };
    
    reader.readAsText(file);
}

// Parsear frontmatter YAML
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { content: content, frontmatter: null };
    }
    
    const frontmatterText = match[1];
    const markdownContent = content.replace(frontmatterRegex, '');
    
    // Parsear YAML simple (solo key: value)
    const frontmatter = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) continue;
        
        const key = trimmed.substring(0, colonIndex).trim();
        let value = trimmed.substring(colonIndex + 1).trim();
        
        // Remover comillas simples o dobles
        if ((value.startsWith("'") && value.endsWith("'")) || 
            (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1);
        }
        
        frontmatter[key] = value;
    }
    
    return { content: markdownContent, frontmatter: Object.keys(frontmatter).length > 0 ? frontmatter : null };
}

// Eliminar comandos LaTeX del contenido
function removeLatexCommands(content) {
    // Eliminar comandos LaTeX comunes como \tableofcontents, \newpage, etc.
    // Patrón: \comando seguido opcionalmente de espacios y saltos de línea
    const latexCommandRegex = /\\[a-zA-Z]+\s*(?:\n|$)/g;
    return content.replace(latexCommandRegex, '');
}

// Renderizar Markdown
function renderMarkdown() {
    let htmlContent = marked.parse(state.markdownContent);
    
    // Añadir encabezado con frontmatter si existe
    if (state.frontmatter) {
        const header = createFrontmatterHeader(state.frontmatter);
        htmlContent = header + htmlContent;
    }
    
    state.htmlContent = htmlContent;
    elements.viewer.innerHTML = state.htmlContent;
    
    // Aplicar syntax highlighting
    elements.viewer.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    // Añadir IDs a los encabezados para navegación
    elements.viewer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
    
    // Actualizar paginación si está en modo paginado
    if (state.viewMode === 'paged') {
        calculatePages();
    }
    
    // Actualizar opacidad de botones después de renderizar
    setTimeout(() => {
        updateButtonsOpacity();
        // Forzar actualización después de un momento para asegurar que se aplica
        setTimeout(updateButtonsOpacity, 200);
    }, 100);
}

// Crear encabezado con información del frontmatter
function createFrontmatterHeader(frontmatter) {
    let header = '<div class="document-header">';
    
    if (frontmatter.title) {
        header += `<h1 class="document-title">${escapeHtml(frontmatter.title)}</h1>`;
    }
    
    if (frontmatter.author) {
        header += `<h2 class="document-author">${escapeHtml(frontmatter.author)}</h2>`;
    }
    
    if (frontmatter.date) {
        header += `<p class="document-date">${escapeHtml(frontmatter.date)}</p>`;
    }
    
    header += '</div>';
    return header;
}

// Generar outline
function generateOutline() {
    // Excluir los encabezados del frontmatter (document-header)
    const documentHeader = elements.viewer.querySelector('.document-header');
    const allHeadings = elements.viewer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    state.outline = [];
    
    allHeadings.forEach((heading) => {
        // Excluir si está dentro del document-header
        if (documentHeader && documentHeader.contains(heading)) {
            return;
        }
        
        state.outline.push({
            id: heading.id,
            text: heading.textContent,
            level: parseInt(heading.tagName.charAt(1))
        });
    });
    
    renderOutline();
    // Asegurar que el botón esté visible si hay contenido y la barra está oculta
    updateSidebarButtonVisibility();
}

function renderOutline() {
    if (state.outline.length === 0) {
        elements.outline.innerHTML = `<p class="no-outline">${translations[state.currentLanguage].noHeadings}</p>`;
        return;
    }
    
    elements.outline.innerHTML = state.outline.map(item => {
        const className = `outline-item h${item.level}`;
        return `<div class="${className}" data-id="${item.id}">${escapeHtml(item.text)}</div>`;
    }).join('');
    
    // Añadir event listeners a los items del outline
    elements.outline.querySelectorAll('.outline-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            scrollToHeading(id);
        });
    });
}

function scrollToHeading(id) {
    const heading = document.getElementById(id);
    if (heading) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Actualizar outline activo
        elements.outline.querySelectorAll('.outline-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-id') === id) {
                item.classList.add('active');
            }
        });
    }
}

function updateActiveOutline() {
    const headings = elements.viewer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const scrollPosition = elements.viewer.scrollTop + 100;
    
    let activeId = null;
    headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const viewerRect = elements.viewer.getBoundingClientRect();
        const relativeTop = rect.top - viewerRect.top + elements.viewer.scrollTop;
        
        if (relativeTop <= scrollPosition) {
            activeId = heading.id;
        }
    });
    
    if (activeId) {
        elements.outline.querySelectorAll('.outline-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-id') === activeId) {
                item.classList.add('active');
            }
        });
    }
}

// Aplicar temas
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    
    // Actualizar estilos de highlight.js según el tema
    const link = document.querySelector('link[href*="highlight.js"]');
    if (link) {
        const themeMap = {
            'light': 'github',
            'dark': 'github-dark',
            'sepia': 'github',
            'gray': 'github',
            'contrast': 'default'
        };
        
        const highlightTheme = themeMap[state.currentTheme] || 'github';
        const newHref = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${highlightTheme}.min.css`;
        
        if (link.href !== newHref) {
            link.href = newHref;
            // Re-aplicar highlighting después de cambiar el tema
            setTimeout(() => {
                elements.viewer.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }, 100);
        }
    }
}

// Aplicar fuente
function applyFont() {
    elements.viewer.style.fontFamily = `'${state.currentFont}', serif`;
}

// Aplicar tamaño de fuente
function applyFontSize() {
    const baseSize = state.fontSize;
    elements.viewer.style.fontSize = `${baseSize}px`;
    
    // Aplicar tamaños proporcionales a los encabezados
    const scale = {
        h1: 2.5,
        h2: 2.0,
        h3: 1.5,
        h4: 1.25,
        h5: 1.1,
        h6: 1.0
    };
    
    Object.keys(scale).forEach(tag => {
        const headings = elements.viewer.querySelectorAll(tag);
        headings.forEach(heading => {
            heading.style.fontSize = `${baseSize * scale[tag]}px`;
        });
    });
    
    // Recalcular páginas si está en modo paginado
    if (state.viewMode === 'paged') {
        setTimeout(() => {
            calculatePages();
        }, 100);
    }
}

// Aplicar ancho
function applyWidth() {
    elements.viewer.style.width = `${state.width}%`;
    // Recalcular páginas si está en modo paginado
    if (state.viewMode === 'paged') {
        setTimeout(() => {
            calculatePages();
        }, 100);
    }
}

// Aplicar modo de vista
function applyViewMode() {
    if (state.viewMode === 'paged') {
        elements.viewerContainer.classList.add('paged');
        elements.paginationControls.style.display = 'flex';
        // Esperar a que el layout se actualice antes de calcular páginas
        setTimeout(() => {
            calculatePages();
            updateButtonsOpacity();
        }, 100);
    } else {
        elements.viewerContainer.classList.remove('paged');
        elements.paginationControls.style.display = 'none';
        elements.viewer.scrollTop = 0;
        updateButtonsOpacity();
    }
}

// Calcular páginas para modo paginado
function calculatePages() {
    if (!elements.viewer || elements.viewer.scrollHeight === 0) {
        state.totalPages = 1;
        state.currentPage = 0;
        updatePaginationUI();
        return;
    }
    
    const viewerHeight = elements.viewer.clientHeight;
    const scrollHeight = elements.viewer.scrollHeight;
    
    if (viewerHeight === 0) {
        // Esperar un poco más si el viewer aún no tiene altura
        setTimeout(calculatePages, 50);
        return;
    }
    
    state.totalPages = Math.max(1, Math.ceil(scrollHeight / viewerHeight));
    state.currentPage = Math.min(state.currentPage, state.totalPages - 1);
    updatePaginationUI();
    updateButtonsOpacity();
}

function navigatePage(direction) {
    const viewerHeight = elements.viewer.clientHeight;
    const newPage = state.currentPage + direction;
    
    if (newPage >= 0 && newPage < state.totalPages) {
        state.currentPage = newPage;
        elements.viewer.scrollTo({
            top: state.currentPage * viewerHeight,
            behavior: 'smooth'
        });
        updatePaginationUI();
        updateButtonsOpacity();
    }
}

function updatePaginationUI() {
    const t = translations[state.currentLanguage];
    elements.pageInfo.textContent = t.pageInfo
        .replace('{current}', state.currentPage + 1)
        .replace('{total}', state.totalPages);
    elements.prevPageBtn.disabled = state.currentPage === 0;
    elements.nextPageBtn.disabled = state.currentPage >= state.totalPages - 1;
}

// Toggle sidebar
function toggleSidebar() {
    elements.sidebar.classList.toggle('hidden');
    updateSidebarButtonVisibility();
}

// Actualizar visibilidad del botón de sidebar
function updateSidebarButtonVisibility() {
    if (elements.sidebar.classList.contains('hidden')) {
        elements.showSidebarBtn.classList.remove('hidden');
    } else {
        elements.showSidebarBtn.classList.add('hidden');
    }
}

// Toggle panel de controles
function toggleControlsPanel() {
    elements.controlsPanel.classList.toggle('hidden');
    updateControlsButtonVisibility();
}

// Actualizar visibilidad del botón de controles
function updateControlsButtonVisibility() {
    if (elements.controlsPanel.classList.contains('hidden')) {
        elements.showControlsBtn.classList.remove('hidden');
    } else {
        elements.showControlsBtn.classList.add('hidden');
    }
}

// Actualizar opacidad de los botones según scroll/página
function updateButtonsOpacity() {
    if (!elements.showSidebarBtn || !elements.showControlsBtn) return;
    
    let shouldBeVisible = false;
    
    if (state.viewMode === 'paged') {
        // En modo paginado: visible solo en la primera página
        shouldBeVisible = state.currentPage === 0;
    } else {
        // En modo continuo: visible solo cuando está en la parte superior
        let scrollTop = 0;
        
        // Verificar el viewer primero (puede tener scroll interno)
        if (elements.viewer && elements.viewer.scrollTop !== undefined) {
            scrollTop = elements.viewer.scrollTop;
        }
        
        // También verificar window/document (el scroll puede estar ahí)
        const windowScroll = window.scrollY || 
                            window.pageYOffset || 
                            document.documentElement.scrollTop || 
                            document.body.scrollTop || 0;
        
        // Usar el mayor de los dos (el que realmente tiene scroll)
        scrollTop = Math.max(scrollTop, windowScroll);
        
        shouldBeVisible = scrollTop <= 10;
    }
    
    // Aplicar opacidad a los botones
    if (shouldBeVisible) {
        elements.showSidebarBtn.classList.remove('dimmed');
        elements.showControlsBtn.classList.remove('dimmed');
    } else {
        elements.showSidebarBtn.classList.add('dimmed');
        elements.showControlsBtn.classList.add('dimmed');
    }
}

// Cambiar idioma
function changeLanguage(lang) {
    if (translations[lang]) {
        state.currentLanguage = lang;
        updateLanguage();
        saveLanguage();
    }
}

// Actualizar todos los textos según el idioma actual
function updateLanguage() {
    const t = translations[state.currentLanguage];
    
    // Actualizar atributo lang del HTML
    document.documentElement.lang = state.currentLanguage;
    
    // Actualizar título
    document.title = t.appTitle;
    
    // Actualizar elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // Actualizar aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (t[key]) {
            el.setAttribute('aria-label', t[key]);
        }
    });
    
    // Actualizar opciones de select
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (t[key]) {
            option.textContent = t[key];
        }
    });
    
    // Actualizar botones de idioma activo
    elements.langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === state.currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Actualizar paginación si está visible
    if (elements.paginationControls && elements.paginationControls.style.display !== 'none') {
        updatePaginationUI();
    }
}

// Cargar idioma guardado
function loadLanguage() {
    const saved = localStorage.getItem('mdReaderLanguage');
    if (saved && translations[saved]) {
        state.currentLanguage = saved;
    }
}

// Guardar idioma
function saveLanguage() {
    localStorage.setItem('mdReaderLanguage', state.currentLanguage);
}

// Guardar y cargar configuración
function saveSettings() {
    const settings = {
        theme: state.currentTheme,
        font: state.currentFont,
        fontSize: state.fontSize,
        width: state.width,
        viewMode: state.viewMode
    };
    localStorage.setItem('mdReaderSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('mdReaderSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            state.currentTheme = settings.theme || 'light';
            state.currentFont = settings.font || 'Inter';
            state.fontSize = settings.fontSize || 16;
            state.width = settings.width || 70;
            state.viewMode = settings.viewMode || 'continuous';
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
}

function applySettings() {
    elements.themeSelect.value = state.currentTheme;
    elements.fontSelect.value = state.currentFont;
    elements.fontSizeSelect.value = state.fontSize;
    elements.fontSizeValue.textContent = `${state.fontSize}px`;
    elements.widthSelect.value = state.width;
    elements.widthValue.textContent = `${state.width}%`;
    elements.viewModeSelect.value = state.viewMode;
    
    applyTheme();
    applyFont();
    applyFontSize();
    applyWidth();
    applyViewMode();
}

// Utilidades
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Inicializar visibilidad del botón al cargar
function initSidebarState() {
    // La barra está oculta por defecto, así que el botón debe estar visible
    updateSidebarButtonVisibility();
    // El panel de controles también está oculto por defecto
    updateControlsButtonVisibility();
    // Inicializar opacidad de botones
    updateButtonsOpacity();
}

