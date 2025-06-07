// ==== GLOBAL MOCK DATA ====
const MOCK_CONTAS = [
    {
        id: 1,
        plataforma: 'psn',
        preco: 110,
        jogos: ['FIFA', 'GTA', 'COD'],
        titulo: 'Conta PSN Premium',
        descricao: 'Conta original, com jogos FIFA, GTA e COD. Pronta para uso.',
        img: 'assets/conta-psn.jpg'
    },
    {
        id: 2,
        plataforma: 'steam',
        preco: 239,
        jogos: ['Elden Ring', 'Cyberpunk 2077', 'CS:GO'],
        titulo: 'Conta Steam 25 Jogos',
        descricao: 'Mais de 25 jogos AAA. Ótima reputação.',
        img: 'assets/conta-steam.jpg'
    },
    {
        id: 3,
        plataforma: 'xbox',
        preco: 155,
        jogos: ['Forza', 'Halo', 'Minecraft'],
        titulo: 'Conta Xbox Ultimate',
        descricao: 'Com Forza, Halo e Minecraft. 1 ano Gold incluso.',
        img: 'assets/conta-xbox.jpg'
    },
    {
        id: 4,
        plataforma: 'psn',
        preco: 70,
        jogos: ['Spider-Man', 'God of War'],
        titulo: 'PSN Jogos Exclusivos',
        descricao: 'Jogos exclusivos da PlayStation. Entrega rápida.',
        img: 'assets/conta-psn2.jpg'
    }
];

const MOCK_GIFTCARDS = [
    {
        id: 1,
        plataforma: 'xbox',
        valor: 100,
        titulo: 'Gift Card Xbox R$100',
        descricao: 'Receba seu código na hora por e-mail.',
        preco: 95,
        img: 'assets/giftcard-xbox.jpeg'
    },
    {
        id: 2,
        plataforma: 'psn',
        valor: 50,
        titulo: 'Gift Card PSN R$50',
        descricao: 'Ideal para renovar sua Plus.',
        preco: 49,
        img: 'assets/giftcard-psn.webp'
    },
    {
        id: 3,
        plataforma: 'steam',
        valor: 60,
        titulo: 'Gift Card Steam R$60',
        descricao: 'Desbloqueie jogos e DLCs no Steam.',
        preco: 59,
        img: 'assets/giftcard-steam.webp'
    },
    {
        id: 4,
        plataforma: 'googleplay',
        valor: 30,
        titulo: 'Gift Card Google Play R$30',
        descricao: 'Use em apps, jogos e filmes no Android.',
        preco: 28,
        img: 'assets/giftcard-googleplay.png'
    }
];

// ==== USER SESSION & STORAGE ====

function getUsers() {
    return JSON.parse(localStorage.getItem('hsstore_users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('hsstore_users', JSON.stringify(users));
}
function getSession() {
    return JSON.parse(localStorage.getItem('hsstore_session') || 'null');
}
function setSession(session) {
    localStorage.setItem('hsstore_session', JSON.stringify(session));
}
function clearSession() {
    localStorage.removeItem('hsstore_session');
}

// ==== PROTECTED NAVIGATION ====
function updateNavAuth() {
    const session = getSession();
    const navCadastro = document.getElementById('cadastroProdutoNav');
    const loginLink = document.getElementById('loginLink');
    if (navCadastro) {
        if (session && session.email) {
            navCadastro.classList.remove('hidden');
        } else {
            navCadastro.classList.add('hidden');
        }
    }
    if (loginLink) {
        if (session && session.email) {
            loginLink.innerText = 'Sair';
            loginLink.href = '#logout';
            loginLink.onclick = function(e) {
                e.preventDefault();
                clearSession();
                window.location.reload();
            };
        } else {
            loginLink.innerText = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
    }
}

// ==== HAMBURGER MENU ====
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        document.body.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }
    updateNavAuth();

    // Bloqueia acesso à página de cadastro de produto se não logado
    if (window.location.pathname.includes('cadastro-produtos.html')) {
        const session = getSession();
        if (!session || !session.email) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'login.html';
        }
    }
});

// ==== INDEX: CAROUSEL =====
(function initCarousel() {
    if (!document.getElementById('carousel')) return;
    const track = document.getElementById('carouselTrack');
    const prev = document.getElementById('carouselPrev');
    const next = document.getElementById('carouselNext');
    let position = 0;
    const cardWidth = 280 + 32; // width + gap

    function updateCarousel() {
        track.style.transform = `translateX(${-position * cardWidth}px)`;
    }
    prev.addEventListener('click', () => {
        position = Math.max(0, position - 1);
        updateCarousel();
    });
    next.addEventListener('click', () => {
        position = Math.min(track.children.length - 1, position + 1);
        updateCarousel();
    });
})();

// ==== CONTAS LISTAGEM E FILTRO ====
function renderContasList(contas) {
    const container = document.getElementById('contasListagem');
    if (!container) return;
    if (!contas.length) {
        container.innerHTML = `<p style="color:#ffb32b;font-weight:600;">Nenhuma conta encontrada.</p>`;
        return;
    }
    container.innerHTML = contas.map(conta => `
        <div class="card-produto animated-card" tabindex="0">
            <img src="${conta.img}" alt="${conta.titulo}">
            <div class="produto-info">
                <h3>${conta.titulo}</h3>
                <p>${conta.descricao}</p>
                <span class="price">R$${conta.preco.toFixed(2)}</span>
                <button class="btn-secondary comprar-btn" data-id="${conta.id}">Comprar</button>
            </div>
        </div>
    `).join('');
    // animação nos cards
    setTimeout(() => {
        document.querySelectorAll('.card-produto').forEach((el, i) => {
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.opacity = 1;
                el.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    el.style.transform = '';
                }, 150);
            }, 100 + i * 60);
        });
    }, 80);

    // Botão comprar
    container.querySelectorAll('.comprar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Compra simulada! Em breve você poderá realizar compras reais.');
        });
    });
}
if (document.getElementById('contasListagem')) {
    renderContasList(MOCK_CONTAS);

    document.getElementById('filtroContas').addEventListener('submit', function(e) {
        e.preventDefault();
        let plat = document.getElementById('plataforma').value;
        let preco = document.getElementById('preco').value;
        let jogo = document.getElementById('jogo').value.toLowerCase();
        let filtradas = MOCK_CONTAS.filter(c => {
            let ok = true;
            if (plat && c.plataforma !== plat) ok = false;
            if (preco) {
                let [min, max] = preco === '301+' ? [301, Infinity] : preco.split('-').map(Number);
                if (c.preco < min || c.preco > max) ok = false;
            }
            if (jogo && !c.jogos.some(j => j.toLowerCase().includes(jogo))) ok = false;
            return ok;
        });
        renderContasList(filtradas);
    });
}

// ==== GIFTCARDS LISTAGEM E FILTRO ====
function renderGiftcardsList(giftcards) {
    const container = document.getElementById('giftcardsListagem');
    if (!container) return;
    if (!giftcards.length) {
        container.innerHTML = `<p style="color:#ffb32b;font-weight:600;">Nenhum gift card encontrado.</p>`;
        return;
    }
    container.innerHTML = giftcards.map(gc => `
        <div class="card-produto animated-card" tabindex="0">
            <img src="${gc.img}" alt="${gc.titulo}">
            <div class="produto-info">
                <h3>${gc.titulo}</h3>
                <p>${gc.descricao}</p>
                <span class="price">R$${gc.preco.toFixed(2)}</span>
                <button class="btn-secondary comprar-btn" data-id="${gc.id}">Comprar</button>
            </div>
        </div>
    `).join('');
    setTimeout(() => {
        document.querySelectorAll('.card-produto').forEach((el, i) => {
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.opacity = 1;
                el.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    el.style.transform = '';
                }, 150);
            }, 100 + i * 60);
        });
    }, 80);

    container.querySelectorAll('.comprar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Compra simulada! Em breve você poderá realizar compras reais.');
        });
    });
}
if (document.getElementById('giftcardsListagem')) {
    renderGiftcardsList(MOCK_GIFTCARDS);

    document.getElementById('filtroGiftcards').addEventListener('submit', function(e) {
        e.preventDefault();
        let plat = document.getElementById('plataformaGift').value;
        let filtradas = plat ? MOCK_GIFTCARDS.filter(g => g.plataforma === plat) : MOCK_GIFTCARDS;
        renderGiftcardsList(filtradas);
    });
}

// ==== LOGIN / CADASTRO ====
if (document.getElementById('loginForm')) {
    // Troca entre login/cadastro
    const loginCont = document.getElementById('loginContainer');
    const registerCont = document.getElementById('registerContainer');
    document.getElementById('showRegister').onclick = (e) => {
        e.preventDefault();
        loginCont.classList.add('hidden');
        registerCont.classList.remove('hidden');
    };
    document.getElementById('showLogin').onclick = (e) => {
        e.preventDefault();
        registerCont.classList.add('hidden');
        loginCont.classList.remove('hidden');
    };

    // Login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const senha = document.getElementById('loginPassword').value;
        const users = getUsers();
        const user = users.find(u => u.email === email && u.senha === senha);
        if (user) {
            setSession({ nome: user.nome, email: user.email, trader: user.trader });
            window.location.href = 'index.html';
        } else {
            alert('E-mail ou senha incorretos!');
        }
    });

    // Cadastro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim().toLowerCase();
        const senha = document.getElementById('registerPassword').value;
        const trader = document.getElementById('isTrader').checked;
        let users = getUsers();
        if (users.some(u => u.email === email)) {
            alert('E-mail já cadastrado!');
        } else {
            users.push({ nome, email, senha, trader });
            setUsers(users);
            setSession({ nome, email, trader });
            window.location.href = trader ? 'cadastro-produtos.html' : 'index.html';
        }
    });

    // Cadastro automático se #cadastro na url
    if (window.location.hash === '#cadastro') {
        loginCont.classList.add('hidden');
        registerCont.classList.remove('hidden');
    }
}

// ==== CADASTRO DE PRODUTO ====
if (document.getElementById('cadastroProdutoForm')) {
    document.getElementById('cadastroProdutoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const tipo = document.getElementById('tipoProduto').value;
        const plataforma = document.getElementById('plataformaProduto').value;
        const titulo = document.getElementById('tituloProduto').value.trim();
        const descricao = document.getElementById('descricaoProduto').value.trim();
        const preco = Number(document.getElementById('precoProduto').value);
        const img = document.getElementById('imagemProduto').value.trim() || 'assets/conta-psn.jpg';
        // Salvar no localStorage (mock)
        let produtos = JSON.parse(localStorage.getItem('hsstore_produtos') || '[]');
        produtos.push({ tipo, plataforma, titulo, descricao, preco, img });
        localStorage.setItem('hsstore_produtos', JSON.stringify(produtos));
        document.getElementById('cadastroProdutoMsg').classList.remove('hidden');
        document.getElementById('cadastroProdutoMsg').innerText = 'Produto cadastrado com sucesso!';
        setTimeout(() => {
            document.getElementById('cadastroProdutoMsg').classList.add('hidden');
        }, 2500);
        this.reset();
    });
}
// ==== MOCK JOGOS ====
const MOCK_JOGOS = [
    {
        id: 1,
        plataforma: 'psn',
        preco: 119,
        nome: 'FIFA 24',
        descricao: 'Jogo original, ativação digital para PSN.',
        img: 'assets/jogos/fifa24.jpg'
    },
    {
        id: 2,
        plataforma: 'steam',
        preco: 179,
        nome: 'Elden Ring',
        descricao: 'Key Steam global.',
        img: 'assets/jogos/eldenring.jpg'
    },
    {
        id: 3,
        plataforma: 'xbox',
        preco: 99,
        nome: 'Minecraft',
        descricao: 'Ativação via Xbox Live.',
        img: 'assets/jogos/minecraft.jpg'
    },
    {
        id: 4,
        plataforma: 'pc',
        preco: 39,
        nome: 'Among Us',
        descricao: 'Key para PC. Envio imediato.',
        img: 'assets/jogos/amongus.jpg'
    }
];

// ==== JOGOS LISTAGEM E FILTRO ====
function renderJogosList(jogos) {
    const container = document.getElementById('jogosListagem');
    if (!container) return;
    if (!jogos.length) {
        container.innerHTML = `<p style="color:#ffb32b;font-weight:600;">Nenhum jogo encontrado.</p>`;
        return;
    }
    container.innerHTML = jogos.map(jogo => `
        <div class="card-produto animated-card" tabindex="0">
            <img src="${jogo.img}" alt="${jogo.nome}">
            <div class="produto-info">
                <h3>${jogo.nome}</h3>
                <p>${jogo.descricao}</p>
                <span class="price">R$${jogo.preco.toFixed(2)}</span>
                <button class="btn-secondary comprar-btn" data-id="${jogo.id}">Comprar</button>
            </div>
        </div>
    `).join('');
    setTimeout(() => {
        document.querySelectorAll('.card-produto').forEach((el, i) => {
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.opacity = 1;
                el.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    el.style.transform = '';
                }, 150);
            }, 100 + i * 60);
        });
    }, 80);

    container.querySelectorAll('.comprar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Compra simulada! Em breve você poderá realizar compras reais.');
        });
    });
}
if (document.getElementById('jogosListagem')) {
    renderJogosList(MOCK_JOGOS);

    document.getElementById('filtroJogos').addEventListener('submit', function(e) {
        e.preventDefault();
        let plat = document.getElementById('plataformaJogo').value;
        let preco = document.getElementById('precoJogo').value;
        let busca = document.getElementById('buscaJogo').value.toLowerCase();
        let filtradas = MOCK_JOGOS.filter(j => {
            let ok = true;
            if (plat && j.plataforma !== plat) ok = false;
            if (preco) {
                let [min, max] = preco === '301+' ? [301, Infinity] : preco.split('-').map(Number);
                if (j.preco < min || j.preco > max) ok = false;
            }
            if (busca && !j.nome.toLowerCase().includes(busca)) ok = false;
            return ok;
        });
        renderJogosList(filtradas);
    });
}

// ...restante do script.js permanece igual (não duplicar funções, só adicionar esta parte para jogos)