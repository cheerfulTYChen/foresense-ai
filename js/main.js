// main.js
console.log("main.js 已載入，準備翻譯與互動行為...");
document.addEventListener("DOMContentLoaded", function () {
    // === ???? ===
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!reduceMotion && !isMobile) {
        particlesJS("particles-js", {
            particles: {
                number: { value: 90 },
                color: { value: "#00e0ff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3.5, random: true },
                line_linked: { enable: true, distance: 140, color: "#00e0ff", opacity: 0.25, width: 1 },
                move: { enable: true, speed: 1.6 }
            },
            interactivity: {
                events: { onhover: { enable: true, mode: "repulse" } }
            }
        });
    } else {
        const particleLayer = document.getElementById('particles-js');
        if (particleLayer) particleLayer.style.display = 'none';
    }

    // === 語言切換 ===
    // 從 window.i18nData 取得翻譯資料 (由 js/i18n-data.js 提供)
    
    // === ???? ===
    const i18n = window.i18nData;
    const metaCopy = {
        'zh-TW': {
            title: 'ForeSense Tech｜AI 製程優化與品質監控',
            description: 'ForeSense Tech 提供 AI 製程優化、品質監控、知識庫數位化與參數建議，協助製造業提升良率、降低成本、縮短開發週期。',
            locale: 'zh_TW'
        },
        'en': {
            title: 'ForeSense Tech | AI Process Optimization & Quality Monitoring',
            description: 'ForeSense Tech delivers AI-driven process optimization, quality monitoring, knowledge digitization, and parameter recommendations to boost yield, cut costs, and shorten development cycles.',
            locale: 'en_US'
        }
    };

    function setLangButtons(lang) {
        document.querySelectorAll('.lang-switch').forEach(b => {
            if (b.getAttribute('data-lang') === lang) {
                b.classList.remove('bg-white/10', 'text-gray-400');
                b.classList.add('bg-cyan-500/20', 'border', 'border-cyan-500', 'text-white');
            } else {
                b.classList.remove('bg-cyan-500/20', 'border', 'border-cyan-500', 'text-white');
                b.classList.add('bg-white/10', 'text-gray-400');
            }
        });
    }

    function translate(lang) {
        const targetLang = metaCopy[lang] ? lang : 'zh-TW';
        document.documentElement.setAttribute('lang', targetLang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[targetLang] && i18n[targetLang][key] !== undefined) {
                el.textContent = i18n[targetLang][key];
            }
        });

        const meta = metaCopy[targetLang];
        if (meta) {
            document.title = meta.title;

            const descTag = document.querySelector('meta[name="description"]');
            if (descTag) descTag.setAttribute('content', meta.description);

            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', meta.title);

            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', meta.description);

            const ogLocale = document.querySelector('meta[property="og:locale"]');
            if (ogLocale) ogLocale.setAttribute('content', meta.locale);

            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) twitterTitle.setAttribute('content', meta.title);

            const twitterDesc = document.querySelector('meta[name="twitter:description"]');
            if (twitterDesc) twitterDesc.setAttribute('content', meta.description);
        }

        setLangButtons(targetLang);
    }

    // ??????
    translate('zh-TW');

    // ??????
    document.querySelectorAll('.lang-switch').forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            translate(lang);
        });
    });

// === Mobile Menu Logic ===
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // 點擊連結後自動關閉選單
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // === Scroll Spy (Active Link Highlighting) - IntersectionObserver Version ===
    // 使用 IntersectionObserver 取代 scroll 事件，大幅提升效能
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]:not([href="#"]), #right-nav a[href^="#"]');

    // 設定觀察器選項
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // 視窗中間 20% 的區域判定為"可見"
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');

                // 移除所有 active 狀態
                navLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    link.classList.remove('right-nav-active');

                    const href = link.getAttribute('href');
                    if (href === `#${currentId}`) {
                        if (link.closest('#right-nav')) {
                            link.classList.add('right-nav-active');
                        } else {
                            link.classList.add('nav-active');
                        }
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // === 頂部導覽列智慧隱藏邏輯 (保留 scroll 但只做最輕量的檢查) ===
    const topNav = document.querySelector('nav.fixed');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                if (topNav) {
                    if (scrollY > 10) {
                        topNav.classList.add('nav-scrolled');
                    } else {
                        topNav.classList.remove('nav-scrolled');
                    }
                    // 增加閾值避免微小移動閃爍
                    if (Math.abs(scrollY - lastScrollY) > 10) {
                        if (scrollY > lastScrollY && scrollY > 100) {
                            topNav.classList.add('nav-hidden');
                        } else {
                            topNav.classList.remove('nav-hidden');
                        }
                        lastScrollY = scrollY;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // 加入 passive: true 提升滾動效能

    // 為所有導覽連結添加平滑滾動功能
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // 計算正確的滾動位置（考慮固定 header 的高度）
                    const headerHeight = 170; // navbar 的高度
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // 如果是手機版選單，點擊後關閉選單
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });
    });
});




// $(function() {
//     var i18n = {
//         'zh-TW': {
//             'ai_advisor_title': '專屬的製程AI工程師',
//             'ai_advisor_subtitle': '輕鬆與現有設備無縫接軌,為您帶來三大核心價值',
//             'ai_advisor_desc': '結合人工智慧與產業經驗,提供即時分析、預測與決策建議,協助企業提升效率與競爭力。',
//             'ai_advisor_feature1': '24 小時智能諮詢,隨時解答您的問題',
//             'ai_advisor_feature2': '根據數據自動生成最佳解決方案',
//             'ai_advisor_feature3': '持續學習,隨企業成長優化建議',
//             'ai_advisor_opt_title': '生產效率的自動優化師',
//             'ai_advisor_opt_desc1': '就像一位不知疲倦、且永不犯錯的優化師傅。即時分析設備、環境以及歷史批次的數百個參數,透過多目標演算法自動在「最高良率」、「最低成本」與「最短製程時間」之間找到最佳平衡點。',
//             'ai_advisor_opt_desc2': '您不再需要靠經驗反覆試錯,就能快速穩定生產,將良率與效率發揮到極致。',
//             'ai_advisor_opt_value1': '40%↓',
//             'ai_advisor_opt_label1': '調適時間',
//             'ai_advisor_opt_value2': '15%↓',
//             'ai_advisor_opt_label2': '調適成本',
//             'ai_advisor_opt_value3': '10%↑',
//             'ai_advisor_opt_label3': '產品良率',
//             'ai_advisor_qc_title': '品質與成本的智慧管家',
//             'ai_advisor_qc_desc1': '實現預防性品質控制,24小時監控生產狀況。一旦發現參數異常波動,會在問題發生前發出預警,讓您在品質問題產生之前就介入處理。',
//             'ai_advisor_qc_desc2': '精準控制鍍膜厚度與原料配比,將每單位原料的效益最大化,確保營運成本始終處於最佳狀態。',
//             'ai_advisor_qc_value1': '40%↓',
//             'ai_advisor_qc_label1': '分析時間',
//             'ai_advisor_qc_value2': '20%↓',
//             'ai_advisor_qc_label2': '原料耗損',
//             'ai_advisor_qc_value3': '10%↓',
//             'ai_advisor_qc_label3': '不良率',
//             'ai_advisor_know_title': '知識傳承與管理的智慧助理',
//             'ai_advisor_know_desc1': '將資深師傅的寶貴經驗進行數位化，永久保存。我們透過先進的智慧整合技術，將所有分散的維修筆記、設備異常紀錄、標準作業流程（SOP）文件，甚至日常的溝通記錄等隱性知識，集中整理成一套全面且易於檢索的知識庫。',
//             'ai_advisor_know_desc2': '以自然語言對話方式,隨時調用公司累積的智慧。無論新進人員請教還是管理者查詢,都能瞬間獲得最相關、最準確的資訊。',
//             'ai_advisor_know_value1': '40%↓',
//             'ai_advisor_know_label1': '培訓時間',
//             'ai_advisor_know_value2': '40%↓',
//             'ai_advisor_know_label2': '操作錯誤',
//             'ai_advisor_know_value3': '40%↓',
//             'ai_advisor_know_label3': '操作錯誤',
//             'coating_challenges_title': '生產製造都會面臨的挑戰',
//             'coating_challenges_subtitle': '這些痛點不僅直接影響生產效率,更蠶食著您的利潤空間',
//             'coating_challenges_note': '面對上述挑戰,數位化與智慧化是提升鍍膜製程競爭力的關鍵。',
//             'home': '首頁',
//             'about': '關於我們',
//             'service': '服務項目',
//             'industry_applications': '產業應用', // 新增
//             'contact': '聯絡我們',
//             'company_title': '夆泩數位發展',
//             'company_slogan': '專業、創新、信賴的夥伴',
//             'about_content': '夆泩數位發展(ForeSence Tech)專注於數位創新與企業成長,結合專業顧問、技術研發與客製化解決方案,協助客戶在數位時代中脫穎而出。',
//             'about_point1_title': '專業顧問團隊',
//             'about_point1': '我們擁有經驗豐富的顧問團隊,深入了解各產業特性與市場趨勢,為每位客戶量身打造最適合的數位轉型策略,確保方案契合企業需求與發展目標。',
//             'about_point2_title': '跨領域技術整合',
//             'about_point2': '結合 AI、數據分析、雲端技術與軟體開發等多元專業,我們提供全方位的技術整合服務,幫助企業提升營運效率、優化決策流程,在競爭激烈的市場中保持領先地位。',
//             'about_point3_title': '持續創新,追求卓越',
//             'about_point3': '我們的成員來自 U-start 創新創業計畫「RAGtimAIze」團隊與 NYCU 創新創業競賽「好理加太」團隊,擁有豐富的創新實戰經驗。我們秉持著創業家精神,不斷探索新技術、開發創新解決方案,與客戶共同成長,追求卓越表現。',
//             'coating_challenges_item_yield': '不穩定的產品良率',
//             'coating_challenges_item_yield_desc': '產品品質波動大,良率難以控制,導致客戶抱怨與退貨',
//             'coating_challenges_item_equip': '突發的設備故障',
//             'coating_challenges_item_equip_desc': '設備突然故障造成停機,影響交期並增加維修成本',
//             'coating_challenges_item_cost': '持續攀升的營運成本',
//             'coating_challenges_item_cost_desc': '原料浪費嚴重,能源效率低下,成本控制困難',
//             'coating_challenges_item_expert': '老師傅的經驗斷層',
//             'coating_challenges_item_expert_desc': '寶貴的製程經驗無法有效傳承,新人培訓週期長',
//             'service1': 'AI演算法應用',
//             'service1_desc': '透過先進的機器學習技術，我們為製造業量身打造智慧演算法解決方案。從生產參數優化、良率預測到設備異常偵測，AI演算法能夠從海量數據中學習最佳實踐經驗，自動找出最優化的製程參數組合。',
//             'service2': 'AI Agent建置',
//             'service2_desc': '打造企業專屬的智能助理系統，24小時不間斷地協助員工處理日常任務。我們的AI Agent能夠理解自然語言指令，自動執行數據查詢、報告生成、異常通知等重複性工作。透過整合企業內部知識庫與作業流程，AI Agent不僅能即時回答技術問題，更能主動提供操作建議，將資深師傅的寶貴經驗數位化，讓新手也能快速上手複雜製程，有效解決技術傳承斷層問題。',
//             'service3': 'AI 自動作業系統',
//             'service3_desc': '建構端到端的智慧化生產管理平台，實現從原料投入到成品產出的全流程自動化控制。系統整合IoT感測器、生產設備、品管儀器等多元數據源，透過AI即時分析製程狀態，自動調整參數設定，確保產品品質穩定一致。當偵測到異常徵兆時，系統會提前預警並自動啟動應變機制，大幅降低人為錯誤與停機風險，讓您的工廠真正實現智慧製造轉型。',
//             'contact_content': '歡迎透過電子郵件或電話與我們聯繫。',
//             'about_point1_value1': '15+',
//             'about_point1_label1': '年半導體產業經驗',
//             'about_point1_value2': '10+',
//             'about_point1_label2': '年鍍膜產業經驗',
//             'about_point2_value1': '5+',
//             'about_point2_label1': '核心技術領域',
//             'about_point2_value2': '30%',
//             'about_point2_label2': '平均效率提升',
//             'about_point3_value1': '2',
//             'about_point3_label1': '創業競賽獲獎',
//             'about_point3_value2': '100%',
//             'about_point3_label2': '創新精神',
//             'address_label': '地址:',
//             'address': '新竹縣竹北市光明一路349號',
//             'phone_label': '電話:',
//             'phone': '0921-353124、0911-843839',
//             'email_label': 'Email:',
//             'email': 'foresense0729@gmail.com',
//             'service_time_label': '服務時間:',
//             'service_time': '週一至週五 9:00-18:00',
//             'footer': '版權所有 © 2025 夆泩數位發展',

//             // 產業應用場景 (Industry Applications) 新增的鍵值對
//             'industry_applications_title': '深入各產業的智慧製程解決方案',
//             'industry_applications_subtitle': '從半導體到光學鍍膜，ForeSense AI 助力不同產業突破製程瓶頸',
//             'ia_challenges_title': '面臨的挑戰',
//             'ia_solution_title': 'ForeSense 解決方案',
//             'ia_benefit_title': '實際效益',
//             'ia_semi_title': '半導體製造',
//             'ia_semi_overview_title': '產業概況',
//             'ia_semi_overview': '半導體製程中的薄膜沉積是關鍵步驟，直接影響晶片效能與良率。面對先進製程節點的挑戰，製程參數的精準控制至關重要。',
//             'ia_semi_challenge1': '良率波動難預測：製程參數微小變化導致良率大幅下降，傳統經驗法則難以應對 7nm 以下製程的複雜性',
//             'ia_semi_challenge2': '設備維護成本高：Chamber 清潔週期難以最佳化，過度維護浪費資源，維護不足影響產品品質',
//             'ia_semi_challenge3': '新製程開發週期長：新產品導入（NPI）需要大量實驗，耗時 3-6 個月才能穩定量產',
//             'ia_semi_challenge4': '異常反應時間慢：發現製程異常時往往已產出大批不良品，損失慘重',
//             'ia_semi_solution1': 'AI 預測良率模型：分析超過 200+ 製程參數，提前 24 小時預警良率異常，準確率達 92%',
//             'ia_semi_solution2': '智慧設備保養排程：根據實際腔體狀況動態調整 PM（預防性維護）週期，延長設備壽命 15-20%',
//             'ia_semi_solution3': '快速製程優化：透過 AI 建議最佳參數組合，將新製程開發時間縮短 40%',
//             'ia_semi_solution4': '即時異常偵測：3-5 分鐘內發現製程偏移，立即發送警報並提供根因分析',
//             'ia_semi_benefit1': '12-15%',
//             'ia_semi_benefit1_label': '良率提升',
//             'ia_semi_benefit2': '8-10%',
//             'ia_semi_benefit2_label': '設備稼動率提升',
//             'ia_semi_benefit3': '40%',
//             'ia_semi_benefit3_label': 'NPI 時間縮短',
//             'ia_semi_benefit4': '減少報廢成本：年節省 2,000-5,000 萬元',
//             'ia_optic_title': '光學鍍膜',
//             'ia_optic_overview': '光學鍍膜應用於相機鏡頭、AR/VR 顯示器、汽車抬頭顯示器等領域，對膜層厚度、均勻度要求極高。',
//             'ia_optic_challenge1': '膜厚控制精度要求高：奈米級的膜厚偏差會影響光學性能，傳統監控方式反應不及時',
//             'ia_optic_challenge2': '多層膜製程複雜：抗反射膜、濾光片等需要 10-30 層鍍膜，任一層失敗導致整批報廢',
//             'ia_optic_challenge3': '色差與均勻度問題：大面積鍍膜時，邊緣與中心的膜厚差異難以控制',
//             'ia_optic_challenge4': '客製化需求多：不同客戶規格差異大，製程參數調整依賴資深工程師經驗',
//             'ia_optic_solution1': '即時膜厚監控與預測：整合光學監控系統（OMS）數據，AI 即時預測最終膜厚，提前 10-15 秒調整鍍率',
//             'ia_optic_solution2': '多層膜智慧排程：自動計算每層最佳參數，減少人為設定錯誤，成功率提升至 98%',
//             'ia_optic_solution3': '均勻度優化演算法：分析基板旋轉速度、靶材角度等參數，將膜厚均勻度提升 20%',
//             'ia_optic_solution4': '知識庫快速調參：系統記錄所有成功製程參數，新規格產品可在 30 分鐘內找到相似配方',
//             'ia_optic_benefit1': '15-18%',
//             'ia_optic_benefit1_label': '良率提升',
//             'ia_optic_benefit2': '20-25%',
//             'ia_optic_benefit2_label': '膜厚一致性提升',
//             'ia_optic_benefit3': '50%',
//             'ia_optic_benefit3_label': '客製化產品交期縮短',
//             'ia_optic_benefit4': '工程師調參時間節省：60%',
//             'ia_tool_title': '工具機硬膜鍍膜',
//             'ia_tool_overview': '刀具、模具的硬質鍍膜（如 TiN、TiAlN、DLC）決定其耐磨性與使用壽命。',
//             'ia_tool_challenge1': '膜層附著力不穩定：批次間膜層容易剝落，客訴率高',
//             'ia_tool_challenge2': '硬度與韌性難平衡：過硬容易脆裂，過軟耐磨性不足',
//             'ia_tool_challenge3': 'Poor Batch Consistency: Quality variation in workpieces at different positions within the same batch.',
//             'ia_tool_challenge4': 'Process Black Box Issue: Industry relies on master technicians\' experience; technology transfer is difficult.',
//             'ia_tool_solution1': 'Adhesion Early Warning System: Monitors ion bombardment energy and substrate temperature to predict film bonding strength.',
//             'ia_tool_solution2': 'Multi-Objective Parameter Optimization: AI balances hardness (>2500HV) and toughness needs to find optimal deposition conditions.',
//             'ia_tool_solution3': 'In-Furnace Uniformity Control: Optimizes substrate rotation speed and gas distribution, reducing positional variation to < 5%.',
//             'ia_tool_solution4': 'Expert Knowledge Digitalization: Transforms master technicians\' experience into an AI model, allowing novices to achieve high-quality parameters.',
//             'ia_tool_benefit1': '60%',
//             'ia_tool_benefit1_label': 'Customer Complaint Reduction',
//             'ia_tool_benefit2': '25-30%',
//             'ia_tool_benefit2_label': 'Tool Lifespan Extension',
//             'ia_tool_benefit3': '40%',
//             'ia_tool_benefit3_label': 'Batch Consistency Improvement',
//             'ia_tool_benefit4': 'New Staff Training Time Shortened: From 6 months to 2 months'
//         }
//     };
// 
//     function setLang(lang) {
//         // 一般文字切換
//         $('[data-i18n]').each(function() {
//             var key = $(this).data('i18n');
//             if (i18n[lang][key]) {
//                 $(this).text(i18n[lang][key]);
//             }
//         });
//         $('#footer').text(i18n[lang]['footer']);
//     }
// 
//     // 預設語言
//     setLang('zh-TW');
// 
//     // 切換語言
//     $('.lang-switch').click(function() {
//         var lang = $(this).data('lang');
//         setLang(lang);
//     });
// 
//     // 載入獨立頁尾
//     $('#footer').load('footer.html');
// });



























// === Loading Screen Logic ===
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        // 確保至少顯示一小段時間，避免閃爍 (可選)
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 700); // 等待淡出動畫結束 (配合 CSS duration-700)
        }, 500); // 額外延遲 0.5 秒，讓使用者看清楚帥氣的 Loading
    }
});
