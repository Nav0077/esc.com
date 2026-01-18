
// --- Component Loader ---
async function loadComponents() {
    // Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('header.html');
            const html = await response.text();
            headerPlaceholder.innerHTML = html;
            
            // Highlight Active Link
            const currentPage = window.location.pathname.split("/").pop() || 'index.html';
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => {
                if(link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });

            // Initialize Mobile Menu Logic (since it was just injected)
            // No extra init needed as toggleMobileMenu is global, but elements exist now
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('footer.html');
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
}

// Initialize Components on Load
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    
    // Stats Observer
    const statsSection = document.querySelector('#home-stats'); 
    if(statsSection) observer.observe(statsSection);
});

// --- Mobile Menu Toggle ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// --- Stats Counter Animation ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const inc = target / 50;
                const updateCount = () => {
                    count += inc;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            observer.unobserve(entry.target);
        }
    });
});

// --- Tournament Tab Logic ---
function switchTournamentTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tournament-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });
    
    // Show target
    const target = document.getElementById('tab-' + tabName);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('block');
    }
    
    // Reset buttons
    document.querySelectorAll('.tournament-tab').forEach(el => {
        el.classList.remove('text-yellow-500', 'border-yellow-500', 'active');
        el.classList.add('text-gray-500', 'border-transparent');
    });
    
    // Activate button (Using event.currentTarget to be safe)
    if (event && event.currentTarget) {
        event.currentTarget.classList.remove('text-gray-500', 'border-transparent');
        event.currentTarget.classList.add('text-yellow-500', 'border-yellow-500', 'active');
    }
}

// --- Player Filters ---
function filterPlayers(role) {
    document.querySelectorAll('.player-card').forEach(card => {
        if (role === 'all' || card.dataset.role === role) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.player-filter').forEach(btn => {
        btn.classList.remove('bg-amber-500', 'text-slate-900');
        btn.classList.add('glass-panel', 'text-slate-300');
    });
    event.target.classList.remove('glass-panel', 'text-slate-300');
    event.target.classList.add('bg-amber-500', 'text-slate-900');
}

// --- Player Data & Modal ---
const playerData = {
    rahul: {
        name: "Rahul Sharma",
        role: "Top Order Batsman",
        style: "Right-hand Bat",
        born: "Oct 12, 1995 (29y)",
        batting: { matches: 89, innings: 85, notout: 12, runs: 2847, hs: "142*", avg: 48.2, bf: 2012, sr: 141.5, hundreds: 6, fifties: 18, fours: 287, sixes: 98 },
        bowling: { matches: 89, innings: 12, balls: 245, runs: 310, wkts: 8, bbi: "2/24", econ: 7.59, avg: 38.7 },
        recent: [87, 54, 12, 78, 45]
    },
    amit: {
        name: "Amit Patel",
        role: "Bowler",
        style: "Right-arm Fast",
        born: "Jan 05, 1998 (26y)",
        batting: { matches: 78, innings: 34, notout: 15, runs: 412, hs: "34*", avg: 14.2, bf: 310, sr: 132.9, hundreds: 0, fifties: 0, fours: 32, sixes: 12 },
        bowling: { matches: 78, innings: 76, balls: 1780, runs: 1450, wkts: 187, bbi: "6/23", econ: 6.2, avg: 18.4, fiveWkts: 8 },
        recent: ["3/34", "1/45", "4/22", "2/30", "0/28"]
    },
    arjun: {
        name: "Arjun Reddy",
        role: "All Rounder",
        style: "Right-hand Bat / RA Med",
        born: "Mar 22, 1997 (27y)",
        batting: { matches: 55, innings: 52, notout: 8, runs: 1523, hs: "89", avg: 34.6, bf: 1100, sr: 138.4, hundreds: 0, fifties: 11, fours: 145, sixes: 45 },
        bowling: { matches: 55, innings: 50, balls: 1100, runs: 1050, wkts: 98, bbi: "4/45", econ: 5.7, avg: 22.1, fiveWkts: 2 },
        recent: [32, "2/30", 45, "1/22", 67]
    }
};

function showPlayerStats(id) {
    const player = playerData[id] || playerData.rahul;
    const modal = document.getElementById('playerModal');
    const content = document.getElementById('playerModalContent');
    
    if(!modal || !content) return;

    // Generate Recent Form HTML
    let recentHtml = '';
    player.recent.forEach(score => {
        const isWkt = typeof score === 'string' && score.includes('/');
        const bgClass = isWkt ? 'bg-purple-900/40 border-purple-500/40' : (score >= 50 ? 'bg-green-900/40 border-green-500/40' : 'bg-gray-800 border-gray-700');
        const textClass = isWkt ? 'text-purple-400' : (score >= 50 ? 'text-green-400' : 'text-gray-400');
        
        recentHtml += `<div class="w-14 h-14 rounded-xl border ${bgClass} flex items-center justify-center font-black ${textClass} text-sm shadow-lg">${score}</div>`;
    });

    content.innerHTML = `
        <!-- Header -->
        <div class="relative h-64 bg-gradient-to-r from-gray-900 to-black rounded-t-2xl overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div class="absolute bottom-0 left-0 p-8 flex items-end gap-8 z-10 w-full">
                <div class="w-32 h-32 rounded-2xl bg-gray-800 border-4 border-black flex items-center justify-center text-6xl shadow-2xl relative -mb-4">
                    <i class="fas fa-user text-gray-600"></i>
                    <div class="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-black border-2 border-black">#07</div>
                </div>
                <div class="mb-2 flex-1">
                    <h2 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">${player.name}</h2>
                    <div class="flex items-center gap-4">
                        <span class="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">${player.role}</span>
                        <span class="text-gray-400 text-sm font-medium"><i class="fas fa-map-marker-alt mr-1"></i> Bangalore, IND</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-8 bg-black">
            <!-- Bio Info -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-white/5">
                <div class="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                    <span class="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Batting Style</span>
                    <span class="text-white font-bold text-sm">${player.style}</span>
                </div>
                <div class="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                    <span class="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Born</span>
                    <span class="text-white font-bold text-sm">${player.born}</span>
                </div>
                <div class="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                    <span class="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Team Role</span>
                    <span class="text-white font-bold text-sm">${player.role}</span>
                </div>
                 <div class="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                    <span class="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Matches</span>
                    <span class="text-yellow-500 font-black text-xl">${player.batting.matches}</span>
                </div>
            </div>

            <!-- Career Stats -->
            <div class="mb-10">
                <h3 class="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-1 h-5 bg-yellow-500 rounded-full"></span> Career Statistics
                </h3>
                
                <!-- Batting Table -->
                <div class="mb-8 overflow-hidden rounded-xl border border-white/5">
                    <div class="bg-gray-900/80 px-4 py-2 border-b border-white/5">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Batting & Fielding</h4>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left stats-table">
                            <thead class="bg-black">
                                <tr>
                                    <th>Mat</th>
                                    <th>Inn</th>
                                    <th>NO</th>
                                    <th>Runs</th>
                                    <th>HS</th>
                                    <th>Avg</th>
                                    <th>BF</th>
                                    <th>SR</th>
                                    <th>100</th>
                                    <th>50</th>
                                    <th>4s</th>
                                    <th>6s</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-300 bg-gray-900/20">
                                <tr>
                                    <td class="font-bold">${player.batting.matches}</td>
                                    <td>${player.batting.innings}</td>
                                    <td>${player.batting.notout}</td>
                                    <td class="font-black text-white text-lg">${player.batting.runs}</td>
                                    <td>${player.batting.hs}</td>
                                    <td class="font-bold text-yellow-500">${player.batting.avg}</td>
                                    <td>${player.batting.bf}</td>
                                    <td class="font-bold">${player.batting.sr}</td>
                                    <td>${player.batting.hundreds}</td>
                                    <td class="text-white">${player.batting.fifties}</td>
                                    <td>${player.batting.fours}</td>
                                    <td>${player.batting.sixes}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Bowling Table -->
                <div class="overflow-hidden rounded-xl border border-white/5">
                     <div class="bg-gray-900/80 px-4 py-2 border-b border-white/5">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Bowling</h4>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left stats-table">
                            <thead class="bg-black">
                                <tr>
                                    <th>Mat</th>
                                    <th>Inn</th>
                                    <th>Balls</th>
                                    <th>Runs</th>
                                    <th>Wkts</th>
                                    <th>BBI</th>
                                    <th>Ave</th>
                                    <th>Econ</th>
                                    <th>5w</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-300 bg-gray-900/20">
                                <tr>
                                    <td class="font-bold">${player.bowling.matches}</td>
                                    <td>${player.bowling.innings}</td>
                                    <td>${player.bowling.balls}</td>
                                    <td>${player.bowling.runs}</td>
                                    <td class="font-black text-white text-lg">${player.bowling.wkts}</td>
                                    <td>${player.bowling.bbi}</td>
                                    <td>${player.bowling.avg}</td>
                                    <td class="font-bold text-green-500">${player.bowling.econ}</td>
                                    <td>${player.bowling.fiveWkts || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Recent Form -->
            <div>
                <h3 class="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-1 h-5 bg-blue-500 rounded-full"></span> Recent Form
                </h3>
                <div class="flex flex-wrap gap-4">
                    ${recentHtml}
                </div>
                <p class="text-xs text-gray-500 mt-4">* Last 5 Matches (Most recent last)</p>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closePlayerModal() {
    document.getElementById('playerModal').classList.add('hidden');
}

// --- Match Modal Logic ---
function showMatchDetails(id) {
    const modal = document.getElementById('matchModal');
    const content = document.getElementById('matchModalContent');
    
    if(!modal || !content) return;
    
    // Premium Match Scorecard HTML (Static example)
    content.innerHTML = `
        <!-- Match Header Summary -->
        <div class="relative bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 mb-8 border border-white/5 overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10"><i class="fas fa-trophy text-8xl text-white"></i></div>
            
            <div class="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
                <!-- Team 1 -->
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="w-16 h-16 rounded-xl bg-gradient-gold flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-yellow-500/20">E</div>
                    <div>
                        <h4 class="font-bold text-xl text-white uppercase tracking-wider">Elite SC</h4>
                        <div class="text-4xl font-black text-yellow-500 leading-none">245/6</div>
                        <div class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">20.0 Overs • RR 12.25</div>
                    </div>
                </div>
                
                <!-- Result Badge -->
                <div class="flex flex-col items-center">
                    <span class="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">Result</span>
                    <span class="text-gray-300 font-medium text-sm text-center">Elite SC won by 45 runs</span>
                </div>
                
                <!-- Team 2 -->
                <div class="flex items-center gap-4 w-full md:w-auto flex-row-reverse md:flex-row text-right md:text-left">
                    <div class="text-right">
                        <h4 class="font-bold text-xl text-gray-400 uppercase tracking-wider">Warriors CC</h4>
                        <div class="text-4xl font-black text-white leading-none">200</div>
                        <div class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">18.4 Overs • RR 10.71</div>
                    </div>
                     <div class="w-16 h-16 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-2xl text-gray-500">W</div>
                </div>
            </div>
        </div>
        
        <div class="space-y-8">
            <!-- Innings 1 -->
            <div>
                <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                     <h5 class="font-black text-white text-lg uppercase tracking-widest flex items-center gap-2">
                        <span class="w-1 h-5 bg-yellow-500 rounded-full"></span> Elite SC Batting
                    </h5>
                    <span class="text-xs text-gray-500 font-bold">1st Innings</span>
                </div>
               
                <div class="overflow-x-auto rounded-lg border border-white/5">
                    <table class="w-full text-sm text-left stats-table">
                        <thead class="bg-gray-900">
                            <tr>
                                <th class="pl-4">Batter</th>
                                <th>Dismissal</th>
                                <th>R</th>
                                <th>B</th>
                                <th>4s</th>
                                <th>6s</th>
                                <th>SR</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 bg-black/40">
                            <tr>
                                <td class="pl-4 font-bold text-white">Rahul Sharma</td>
                                <td class="text-xs text-gray-500">not out</td>
                                <td class="font-black text-yellow-500 text-lg">87</td>
                                <td>42</td>
                                <td>8</td>
                                <td>4</td>
                                <td class="font-bold">207.1</td>
                            </tr>
                             <tr>
                                <td class="pl-4 font-bold text-white">Karthik Nair</td>
                                <td class="text-xs text-gray-500">c Keeper b Bowler A</td>
                                <td class="font-bold text-white">45</td>
                                <td>28</td>
                                <td>4</td>
                                <td>2</td>
                                <td class="font-bold">160.7</td>
                            </tr>
                            <tr>
                                <td class="pl-4 font-bold text-gray-400">Arjun Reddy</td>
                                <td class="text-xs text-gray-500">lbw b Bowler B</td>
                                <td class="font-bold text-gray-300">12</td>
                                <td>8</td>
                                <td>1</td>
                                <td>1</td>
                                <td class="font-bold">150.0</td>
                            </tr>
                             <tr>
                                <td class="pl-4 font-bold text-gray-400">Deepak Verma</td>
                                <td class="text-xs text-gray-500">run out</td>
                                <td class="font-bold text-gray-300">28</td>
                                <td>15</td>
                                <td>3</td>
                                <td>1</td>
                                <td class="font-bold">186.6</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

             <!-- Innings 2 Bowling (Simplified) -->
             <div>
                <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                     <h5 class="font-black text-white text-lg uppercase tracking-widest flex items-center gap-2">
                        <span class="w-1 h-5 bg-blue-500 rounded-full"></span> Elite SC Bowling
                    </h5>
                    <span class="text-xs text-gray-500 font-bold">2nd Innings</span>
                </div>
                <div class="overflow-x-auto rounded-lg border border-white/5">
                    <table class="w-full text-sm text-left stats-table">
                        <thead class="bg-gray-900">
                            <tr>
                                <th class="pl-4">Bowler</th>
                                <th>O</th>
                                <th>M</th>
                                <th>R</th>
                                <th>W</th>
                                <th>Eco</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 bg-black/40">
                            <tr>
                                <td class="pl-4 font-bold text-white">Amit Patel</td>
                                <td>4.0</td>
                                <td>0</td>
                                <td>32</td>
                                <td class="font-black text-white">3</td>
                                <td class="font-bold text-green-500">8.0</td>
                            </tr>
                            <tr>
                                <td class="pl-4 font-bold text-white">Arjun Reddy</td>
                                <td>4.0</td>
                                <td>1</td>
                                <td>28</td>
                                <td class="font-black text-white">2</td>
                                <td class="font-bold text-green-500">7.0</td>
                            </tr>
                             <tr>
                                <td class="pl-4 font-bold text-white">Suresh Kumar</td>
                                <td>3.4</td>
                                <td>0</td>
                                <td>45</td>
                                <td class="font-black text-white">4</td>
                                <td class="font-bold">12.2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="mt-8 text-center">
            <button class="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"><i class="fas fa-download mr-2"></i> Download Match Report</button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeMatchModal() {
    document.getElementById('matchModal').classList.add('hidden');
}

// Global Click Listener for Modals
window.onclick = function(event) {
    const pModal = document.getElementById('playerModal');
    const mModal = document.getElementById('matchModal');
    if (pModal && event.target == pModal) pModal.classList.add('hidden');
    if (mModal && event.target == mModal) mModal.classList.add('hidden');
}
