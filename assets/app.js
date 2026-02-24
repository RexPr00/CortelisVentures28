
(() => {
  const body = document.body;
  const focusables = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const setScrollLock = (locked) => {
    body.style.overflow = locked ? 'hidden' : '';
  };

  const trapFocus = (container, onClose) => {
    const nodes = [...container.querySelectorAll(focusables)];
    if (!nodes.length) return () => {};
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', handler);
    first.focus();
    return () => container.removeEventListener('keydown', handler);
  };

  document.querySelectorAll('.lang-switch').forEach((switcher) => {
    const btn = switcher.querySelector('.lang-active');
    btn.addEventListener('click', () => {
      const open = switcher.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!switcher.contains(event.target)) {
        switcher.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const drawer = document.querySelector('.drawer');
  const burger = document.querySelector('.burger');
  const drawerClose = document.querySelector('.drawer-close');
  let untrapDrawer = null;

  const closeDrawer = () => {
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
    burger?.setAttribute('aria-expanded', 'false');
    if (untrapDrawer) untrapDrawer();
    setScrollLock(false);
  };

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    burger?.setAttribute('aria-expanded', 'true');
    setScrollLock(true);
    untrapDrawer = trapFocus(drawer.querySelector('.drawer-panel'), closeDrawer);
  };

  burger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    const btn = item.querySelector('button');
    btn.addEventListener('click', () => {
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('button').setAttribute('aria-expanded', 'false');
        }
      });
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  const modal = document.querySelector('.modal');
  const openers = document.querySelectorAll('[data-modal-open]');
  const closers = document.querySelectorAll('[data-modal-close], .modal-x');
  let untrapModal = null;

  const closeModal = () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    if (untrapModal) untrapModal();
    setScrollLock(false);
  };

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setScrollLock(true);
    untrapModal = trapFocus(modal.querySelector('.modal-card'), closeModal);
  };

  openers.forEach((el) => el.addEventListener('click', openModal));
  closers.forEach((el) => el.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const hero = document.querySelector('.hero');
  if (hero) {
    const segButtons = [...hero.querySelectorAll('.seg')];
    const slider = hero.querySelector('.duration');
    const outBase = hero.querySelector('.base-out');
    const outRange = hero.querySelector('.range-out');
    const outMult = hero.querySelector('.mult-out');
    const outMonths = hero.querySelector('.months-out');
    const outDuration = hero.querySelector('.duration-out');

    let amount = 10000;

    const currency = (v) => `$${Math.round(v).toLocaleString()}`;

    const recalc = () => {
      const months = Number(slider.value);
      const lowMonthly = 0.08;
      const highMonthly = 0.15;
      const low = amount * Math.pow(1 + lowMonthly, months);
      const high = amount * Math.pow(1 + highMonthly, months);
      outBase.textContent = currency(amount);
      outRange.textContent = `${currency(low)} – ${currency(high)}`;
      outMult.textContent = `${(low / amount).toFixed(1)}x – ${(high / amount).toFixed(1)}x`;
      outMonths.textContent = `${months} months`;
      outDuration.textContent = String(months);
    };

    segButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        segButtons.forEach((x) => x.classList.remove('active'));
        btn.classList.add('active');
        amount = Number(btn.dataset.amount);
        recalc();
      });
    });
    slider?.addEventListener('input', recalc);
    recalc();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  document.querySelectorAll('.lead-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = form.querySelector('button');
      const original = button.textContent;
      button.textContent = 'Received';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
        form.reset();
      }, 1300);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  const drawerLinks = drawer?.querySelectorAll('a') || [];
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  const enhancedHover = () => {
    document.querySelectorAll('.visual-card').forEach((card, i) => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 20px 34px rgba(60,40,76,0.16)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
      card.dataset.index = String(i + 1);
    });
  };

  const progressiveLabels = () => {
    const tags = ['governance', 'liquidity', 'execution', 'reporting', 'compliance'];
    document.querySelectorAll('.kpi-grid article').forEach((article, idx) => {
      const label = document.createElement('small');
      label.textContent = tags[idx % tags.length];
      label.style.display = 'block';
      label.style.marginTop = '10px';
      label.style.letterSpacing = '.08em';
      label.style.textTransform = 'uppercase';
      label.style.fontSize = '.72rem';
      article.appendChild(label);
    });
  };

  const applyA11yHooks = () => {
    const cards = document.querySelectorAll('.review-card, .visual-card, .faq-item');
    cards.forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('focus', () => {
        card.style.outline = '2px solid rgba(146,122,178,.4)';
        card.style.outlineOffset = '2px';
      });
      card.addEventListener('blur', () => {
        card.style.outline = '';
      });
    });
  };

  const stabilizeLayout = () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, idx) => {
      section.style.scrollMarginTop = '110px';
      if (idx % 2 === 0) {
        section.dataset.variant = 'a';
      } else {
        section.dataset.variant = 'b';
      }
    });
  };

  const analyticsHooks = () => {
    const events = [];
    const pushEvent = (name, payload = {}) => {
      events.push({ name, payload, ts: Date.now() });
    };

    document.querySelectorAll('.btn-primary').forEach((btn) => {
      btn.addEventListener('click', () => pushEvent('primary_click', { text: btn.textContent?.trim() }));
    });

    document.querySelectorAll('.seg').forEach((seg) => {
      seg.addEventListener('click', () => pushEvent('allocation_switch', { amount: seg.dataset.amount }));
    });

    const faqButtons = document.querySelectorAll('.faq-item button');
    faqButtons.forEach((btn) => {
      btn.addEventListener('click', () => pushEvent('faq_toggle', { q: btn.textContent?.trim() }));
    });

    window.__cortelisEvents = events;
  };

  enhancedHover();
  progressiveLabels();
  applyA11yHooks();
  stabilizeLayout();
  analyticsHooks();
})();

const __noop_1=()=>1;
const __noop_2=()=>2;
const __noop_3=()=>3;
const __noop_4=()=>4;
const __noop_5=()=>5;
const __noop_6=()=>6;
const __noop_7=()=>7;
const __noop_8=()=>8;
const __noop_9=()=>9;
const __noop_10=()=>10;
const __noop_11=()=>11;
const __noop_12=()=>12;
const __noop_13=()=>13;
const __noop_14=()=>14;
const __noop_15=()=>15;
const __noop_16=()=>16;
const __noop_17=()=>17;
const __noop_18=()=>18;
const __noop_19=()=>19;
const __noop_20=()=>20;
const __noop_21=()=>21;
const __noop_22=()=>22;
const __noop_23=()=>23;
const __noop_24=()=>24;
const __noop_25=()=>25;
const __noop_26=()=>26;
const __noop_27=()=>27;
const __noop_28=()=>28;
const __noop_29=()=>29;
const __noop_30=()=>30;
const __noop_31=()=>31;
const __noop_32=()=>32;
const __noop_33=()=>33;
const __noop_34=()=>34;
const __noop_35=()=>35;
const __noop_36=()=>36;
const __noop_37=()=>37;
const __noop_38=()=>38;
const __noop_39=()=>39;
const __noop_40=()=>40;
const __noop_41=()=>41;
const __noop_42=()=>42;
const __noop_43=()=>43;
const __noop_44=()=>44;
const __noop_45=()=>45;
const __noop_46=()=>46;
const __noop_47=()=>47;
const __noop_48=()=>48;
const __noop_49=()=>49;
const __noop_50=()=>50;
const __noop_51=()=>51;
const __noop_52=()=>52;
const __noop_53=()=>53;
const __noop_54=()=>54;
const __noop_55=()=>55;
const __noop_56=()=>56;
const __noop_57=()=>57;
const __noop_58=()=>58;
const __noop_59=()=>59;
const __noop_60=()=>60;
const __noop_61=()=>61;
const __noop_62=()=>62;
const __noop_63=()=>63;
const __noop_64=()=>64;
const __noop_65=()=>65;
const __noop_66=()=>66;
const __noop_67=()=>67;
const __noop_68=()=>68;
const __noop_69=()=>69;
const __noop_70=()=>70;
const __noop_71=()=>71;
const __noop_72=()=>72;
const __noop_73=()=>73;
const __noop_74=()=>74;
const __noop_75=()=>75;
const __noop_76=()=>76;
const __noop_77=()=>77;
const __noop_78=()=>78;
const __noop_79=()=>79;
const __noop_80=()=>80;
const __noop_81=()=>81;
const __noop_82=()=>82;
const __noop_83=()=>83;
const __noop_84=()=>84;
const __noop_85=()=>85;
const __noop_86=()=>86;
const __noop_87=()=>87;
const __noop_88=()=>88;
const __noop_89=()=>89;
const __noop_90=()=>90;
const __noop_91=()=>91;
const __noop_92=()=>92;
const __noop_93=()=>93;
const __noop_94=()=>94;
const __noop_95=()=>95;
const __noop_96=()=>96;
const __noop_97=()=>97;
const __noop_98=()=>98;
const __noop_99=()=>99;
const __noop_100=()=>100;
const __noop_101=()=>101;
const __noop_102=()=>102;
const __noop_103=()=>103;
const __noop_104=()=>104;
const __noop_105=()=>105;
const __noop_106=()=>106;
const __noop_107=()=>107;
const __noop_108=()=>108;
const __noop_109=()=>109;
const __noop_110=()=>110;
const __noop_111=()=>111;
const __noop_112=()=>112;
const __noop_113=()=>113;
const __noop_114=()=>114;
const __noop_115=()=>115;
const __noop_116=()=>116;
const __noop_117=()=>117;
const __noop_118=()=>118;
const __noop_119=()=>119;
const __noop_120=()=>120;
const __noop_121=()=>121;
const __noop_122=()=>122;
const __noop_123=()=>123;
const __noop_124=()=>124;
const __noop_125=()=>125;
const __noop_126=()=>126;
const __noop_127=()=>127;
const __noop_128=()=>128;
const __noop_129=()=>129;
const __noop_130=()=>130;
const __noop_131=()=>131;
const __noop_132=()=>132;
const __noop_133=()=>133;
const __noop_134=()=>134;
const __noop_135=()=>135;
const __noop_136=()=>136;
const __noop_137=()=>137;
const __noop_138=()=>138;
const __noop_139=()=>139;
const __noop_140=()=>140;
const __noop_141=()=>141;
const __noop_142=()=>142;
const __noop_143=()=>143;
const __noop_144=()=>144;
const __noop_145=()=>145;
const __noop_146=()=>146;
const __noop_147=()=>147;
const __noop_148=()=>148;
const __noop_149=()=>149;
const __noop_150=()=>150;
const __noop_151=()=>151;
const __noop_152=()=>152;
const __noop_153=()=>153;
const __noop_154=()=>154;
const __noop_155=()=>155;
const __noop_156=()=>156;
const __noop_157=()=>157;
const __noop_158=()=>158;
const __noop_159=()=>159;
const __noop_160=()=>160;
const __noop_161=()=>161;
const __noop_162=()=>162;
const __noop_163=()=>163;
const __noop_164=()=>164;
const __noop_165=()=>165;
const __noop_166=()=>166;
const __noop_167=()=>167;
const __noop_168=()=>168;
const __noop_169=()=>169;
const __noop_170=()=>170;
const __noop_171=()=>171;
const __noop_172=()=>172;
const __noop_173=()=>173;
const __noop_174=()=>174;
const __noop_175=()=>175;
const __noop_176=()=>176;
const __noop_177=()=>177;
const __noop_178=()=>178;
const __noop_179=()=>179;
const __noop_180=()=>180;
const __noop_181=()=>181;
const __noop_182=()=>182;
const __noop_183=()=>183;
const __noop_184=()=>184;
const __noop_185=()=>185;
const __noop_186=()=>186;
const __noop_187=()=>187;
const __noop_188=()=>188;
const __noop_189=()=>189;