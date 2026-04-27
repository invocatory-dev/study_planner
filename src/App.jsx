import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Plus, Trash2, Calendar, Target, X, RotateCcw, Settings, Palette, Type,
  Image as ImageIcon, BookOpen, ArrowLeft, Star, Volume2, Gamepad2, Pencil,
  ChevronLeft, ChevronRight, Trophy
} from 'lucide-react';

export default function App() {
  const [dDay, setDDay] = useState('');
  const [memo, setMemo] = useState('');
  const [categories, setCategories] = useState([]);
  // timeTable: { "hour-slot": { color: "#xxx", label: "수학" } }
  const [timeTable, setTimeTable] = useState({});
  const [selectedColor, setSelectedColor] = useState('#a8e6e2');
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState('add');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [confirmReset, setConfirmReset] = useState(null); // 'todo' | 'timetable' | null
  const [loaded, setLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('cream');   // 배경 테마
  const [palette, setPalette] = useState('pastel'); // 색상 팔레트
  const [font, setFont] = useState('handwritten'); // 글꼴
  const [page, setPage] = useState('planner'); // 'planner' | 'vocab'

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get('planner-data');
        if (result?.value) {
          const data = JSON.parse(result.value);
          setDDay(data.dDay || '');
          setMemo(data.memo || '');
          setCategories(data.categories || getDefaultCategories());
          if (data.theme) setTheme(data.theme);
          if (data.palette) setPalette(data.palette);
          if (data.font) setFont(data.font);
          // 구버전 호환: 값이 문자열(색상)이면 객체로 변환
          const tt = data.timeTable || {};
          const migrated = {};
          Object.keys(tt).forEach(k => {
            if (typeof tt[k] === 'string') {
              migrated[k] = { color: tt[k], label: '' };
            } else {
              migrated[k] = tt[k];
            }
          });
          setTimeTable(migrated);
        } else {
          setCategories(getDefaultCategories());
        }
      } catch (e) {
        setCategories(getDefaultCategories());
      }
      setLoaded(true);
    };
    loadData();
  }, []);

  // 데이터 저장
  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await window.storage.set('planner-data', JSON.stringify({
          dDay, memo, categories, timeTable, theme, palette, font
        }));
      } catch (e) {
        console.error('저장 실패', e);
      }
    };
    save();
  }, [dDay, memo, categories, timeTable, theme, palette, font, loaded]);

  function getTodayString() {
    const d = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]}.)`;
  }

  function getDefaultCategories() {
    return [
      {
        id: '1',
        title: '수학 숙제',
        color: '#a8e6e2',
        items: [
          { id: '1-1', text: '수달 실력) 오답 5문제 고치기', done: false },
          { id: '1-2', text: '수달 기본) 오답 2문제 고치기', done: false },
        ]
      },
      {
        id: '2',
        title: '구몬',
        color: '#e8c5e8',
        items: [
          { id: '2-1', text: '구몬 수학) 3장', done: false },
          { id: '2-2', text: '구몬 국어) 5장', done: false },
          { id: '2-3', text: '구몬 과학) 5장', done: false },
          { id: '2-4', text: '구몬 한자) 2장', done: false },
        ]
      }
    ];
  }

  const colors = useMemo(() => {
    const palettes = {
      pastel:    ['#a8e6e2', '#e8c5e8', '#fcd5ce', '#fde4a6', '#d4f1c5', '#c5d8f1', '#f1c5c5', '#dcc5f1'],
      vivid:     ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff8c42', '#c780fa', '#00d4aa', '#ff6363'],
      ocean:     ['#a8dadc', '#457b9d', '#74c0fc', '#1d3557', '#48cae4', '#90e0ef', '#0096c7', '#caf0f8'],
      candy:     ['#ffafcc', '#ffc8dd', '#cdb4db', '#bde0fe', '#a2d2ff', '#ffd6a5', '#fdffb6', '#caffbf'],
      forest:    ['#a3b18a', '#588157', '#dad7cd', '#bc6c25', '#ddb892', '#e9edc9', '#fefae0', '#ccd5ae'],
    };
    return palettes[palette];
  }, [palette]);

  // 배경 테마
  const themes = {
    cream:    { name: '크림',   bg: 'linear-gradient(135deg, #fefdf5 0%, #fdf6e8 100%)',  accent: '#dde0fb', accentText: '#6366f1', card: '#fffaf0', cellBorder: '#f5e9d0', cellHover: '#fdf6e8', timeText: '#92704a', headerText: '#a78657' },
    sky:      { name: '하늘',   bg: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',  accent: '#bae6fd', accentText: '#0284c7', card: '#f0f9ff', cellBorder: '#bae6fd', cellHover: '#e0f2fe', timeText: '#0369a1', headerText: '#0284c7' },
    pink:     { name: '벚꽃',   bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',  accent: '#fbcfe8', accentText: '#db2777', card: '#fef6fa', cellBorder: '#fbcfe8', cellHover: '#fdf2f8', timeText: '#be185d', headerText: '#db2777' },
    mint:     { name: '민트',   bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',  accent: '#a7f3d0', accentText: '#059669', card: '#f0fdf6', cellBorder: '#a7f3d0', cellHover: '#d1fae5', timeText: '#047857', headerText: '#059669' },
    lavender: { name: '라벤더', bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', accent: '#e9d5ff', accentText: '#9333ea', card: '#fbf7ff', cellBorder: '#e9d5ff', cellHover: '#f3e8ff', timeText: '#7e22ce', headerText: '#9333ea' },
    night:    { name: '밤하늘', bg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', accent: '#475569', accentText: '#cbd5e1', card: '#334155', cellBorder: '#475569', cellHover: '#475569', timeText: '#cbd5e1', headerText: '#94a3b8', dark: true },
  };
  const currentTheme = themes[theme];

  // 글꼴 프리셋
  const fonts = {
    handwritten: { name: '귀여운 손글씨', body: '"Gaegu", cursive',  display: '"Caveat", cursive' },
    rounded:     { name: '동글동글',     body: '"Jua", sans-serif', display: '"Jua", sans-serif' },
    cute:        { name: '깔끔한 글씨',   body: '"Gowun Dodum", sans-serif', display: '"Gowun Dodum", sans-serif' },
    bold:        { name: '또박또박',      body: '"Do Hyeon", sans-serif', display: '"Do Hyeon", sans-serif' },
  };
  const currentFont = fonts[font];

  // ===== 카테고리/항목 핸들러 =====
  const addCategory = () => {
    const newCat = {
      id: Date.now().toString(),
      title: '새 카테고리',
      color: colors[categories.length % colors.length],
      items: []
    };
    setCategories([...categories, newCat]);
    setEditingCategory(newCat.id);
  };

  const deleteCategory = (id) => setCategories(categories.filter(c => c.id !== id));
  const updateCategoryTitle = (id, title) =>
    setCategories(categories.map(c => c.id === id ? { ...c, title } : c));

  const addItem = (categoryId) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          items: [...c.items, { id: `${categoryId}-${Date.now()}`, text: '', done: false, isNew: true }]
        };
      }
      return c;
    }));
  };

  const updateItemText = (categoryId, itemId, text) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, text, isNew: false } : i)
        };
      }
      return c;
    }));
  };

  const toggleItem = (categoryId, itemId) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i)
        };
      }
      return c;
    }));
  };

  const deleteItem = (categoryId, itemId) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return { ...c, items: c.items.filter(i => i.id !== itemId) };
      }
      return c;
    }));
  };

  // ===== 타임테이블 핸들러 =====
  const handleCellInteraction = (hour, slot, isStart = false) => {
    const key = `${hour}-${slot}`;
    if (isStart) {
      const current = timeTable[key];
      if (current?.color === selectedColor) {
        setDragMode('remove');
        setTimeTable(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        setDragMode('add');
        setTimeTable(prev => ({
          ...prev,
          [key]: { color: selectedColor, label: prev[key]?.label || '' }
        }));
      }
    } else if (isDragging) {
      if (dragMode === 'add') {
        setTimeTable(prev => ({
          ...prev,
          [key]: { color: selectedColor, label: prev[key]?.label || '' }
        }));
      } else {
        setTimeTable(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    }
  };

  // 같은 색으로 인접한 셀들을 자동 병합
  const blocks = useMemo(() => {
    const result = {};
    const hours = Array.from({ length: 19 }, (_, i) => i + 6);

    hours.forEach(hour => {
      result[hour] = [];
      let currentBlock = null;

      for (let slot = 0; slot < 6; slot++) {
        const key = `${hour}-${slot}`;
        const cell = timeTable[key];

        if (cell) {
          if (currentBlock && currentBlock.color === cell.color) {
            currentBlock.endSlot = slot;
            currentBlock.keys.push(key);
            // 라벨이 비어있으면 새 셀의 라벨로 채움
            if (!currentBlock.label && cell.label) {
              currentBlock.label = cell.label;
            }
          } else {
            if (currentBlock) result[hour].push(currentBlock);
            currentBlock = {
              startSlot: slot,
              endSlot: slot,
              color: cell.color,
              label: cell.label || '',
              blockId: key,
              keys: [key]
            };
          }
        } else {
          if (currentBlock) {
            result[hour].push(currentBlock);
            currentBlock = null;
          }
        }
      }
      if (currentBlock) result[hour].push(currentBlock);
    });

    return result;
  }, [timeTable]);

  // 블록의 모든 셀에 라벨 동기화
  const updateBlockLabel = (block, label) => {
    setTimeTable(prev => {
      const next = { ...prev };
      block.keys.forEach(k => {
        if (next[k]) next[k] = { ...next[k], label };
      });
      return next;
    });
  };

  // 진행률
  const totalItems = categories.reduce((sum, c) => sum + c.items.filter(i => i.text).length, 0);
  const doneItems = categories.reduce((sum, c) => sum + c.items.filter(i => i.done && i.text).length, 0);
  const progress = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  // 초기화
  const resetTodo = () => {
    setCategories([]);
    setConfirmReset(null);
  };
  const resetTimeTable = () => {
    setTimeTable({});
    setConfirmReset(null);
  };

  // 오늘 날짜 자동 계산 + 자정마다 갱신
  const [today, setToday] = useState(() => getTodayString());
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timer = setTimeout(() => setToday(getTodayString()), msUntilMidnight + 100);
    return () => clearTimeout(timer);
  }, [today]);

  const hours = Array.from({ length: 19 }, (_, i) => i + 6);

  // 단어장 페이지면 그쪽 컴포넌트 렌더링
  if (page === 'vocab') {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Caveat:wght@400;700&family=Jua&family=Gowun+Dodum&family=Do+Hyeon&display=swap" rel="stylesheet" />
        <VocabularyPage
          onBack={() => setPage('planner')}
          theme={currentTheme}
          font={currentFont}
        />
      </>
    );
  }

  return (
    <div
      className="min-h-screen w-full select-none"
      style={{
        background: currentTheme.bg,
        fontFamily: currentFont.body,
        color: currentTheme.dark ? '#e2e8f0' : undefined
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Caveat:wght@400;700&family=Jua&family=Gowun+Dodum&family=Do+Hyeon&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto px-6 py-8 lg:px-12 lg:py-10">
        {/* 상단 바: 좌측 설정 + 우측 단어장 */}
        <div className="flex justify-between mb-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition"
            aria-label="설정"
          >
            <Settings className="w-6 h-6 text-slate-600" />
          </button>
          <button
            onClick={() => setPage('vocab')}
            className="flex items-center gap-2 px-5 h-12 rounded-full bg-white shadow-md hover:scale-105 active:scale-95 transition font-bold text-slate-700"
            aria-label="단어장"
          >
            <BookOpen className="w-5 h-5 text-indigo-500" />
            단어장
          </button>
        </div>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1
            className="text-6xl lg:text-7xl tracking-wide"
            style={{
              fontFamily: currentFont.display,
              fontWeight: 700,
              color: currentTheme.dark ? '#f1f5f9' : '#1e293b'
            }}
          >
            Study Planner
          </h1>
          <div className="text-lg mt-2" style={{ color: currentTheme.dark ? '#cbd5e1' : '#64748b' }}>
            오늘의 진행률 {progress}% ({doneItems}/{totalItems})
          </div>
        </div>

        {/* 메모 박스 */}
        <div className="mb-6">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘의 한 줄 메모를 적어보세요..."
            className="w-full h-20 px-6 py-3 rounded-3xl text-xl placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            style={{
              backgroundColor: currentTheme.accent,
              color: currentTheme.accentText,
              fontFamily: currentFont.body
            }}
          />
        </div>

        {/* Date & D-Day */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: currentTheme.accentText }} />
            <div className="flex items-center gap-2 px-5 py-2 rounded-full flex-1" style={{ backgroundColor: currentTheme.accent }}>
              <span className="text-lg font-bold" style={{ color: currentTheme.accentText }}>Date)</span>
              <span
                className="flex-1 text-lg"
                style={{ fontFamily: currentFont.body, color: currentTheme.accentText }}
              >
                {today}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 flex-shrink-0" style={{ color: currentTheme.accentText }} />
            <div className="flex items-center gap-2 px-5 py-2 rounded-full flex-1" style={{ backgroundColor: currentTheme.accent }}>
              <span className="text-lg font-bold" style={{ color: currentTheme.accentText }}>D-DAY)</span>
              <input
                type="text"
                value={dDay}
                onChange={(e) => setDDay(e.target.value)}
                placeholder="목표를 입력하세요"
                className="flex-1 bg-transparent text-lg focus:outline-none placeholder-indigo-300"
                style={{ fontFamily: currentFont.body, color: currentTheme.accentText }}
              />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 - 항상 좌우 2분할 */}
        <div className="grid grid-cols-2 gap-6 lg:gap-10">
          {/* 좌측: To-Do List */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-3xl font-bold" style={{ color: currentTheme.dark ? '#f1f5f9' : '#1e293b' }}>To-Do List</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={addCategory}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-sm"
                >
                  <Plus className="w-4 h-4" /> 카테고리
                </button>
                <button
                  onClick={() => setConfirmReset('todo')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 transition text-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 초기화
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {categories.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-lg">할 일이 없어요</p>
                  <p className="text-sm mt-1">+ 카테고리 버튼을 눌러 시작하세요</p>
                </div>
              )}
              {categories.map((cat) => (
                <div key={cat.id} className="group">
                  <div className="flex items-center gap-2 mb-2 ml-2">
                    {editingCategory === cat.id ? (
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => updateCategoryTitle(cat.id, e.target.value)}
                        onBlur={() => setEditingCategory(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingCategory(null)}
                        autoFocus
                        className="text-xl text-slate-700 bg-transparent border-b border-slate-300 focus:outline-none focus:border-slate-500 px-1"
                        style={{ fontFamily: '"Gaegu", cursive' }}
                      />
                    ) : (
                      <h3
                        onClick={() => setEditingCategory(cat.id)}
                        className="text-xl cursor-pointer hover:opacity-80"
                        style={{ color: currentTheme.dark ? '#e2e8f0' : '#334155' }}
                      >
                        &lt;{cat.title}&gt;
                      </h3>
                    )}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          const idx = colors.indexOf(cat.color);
                          const next = colors[(idx + 1) % colors.length];
                          setCategories(categories.map(c => c.id === cat.id ? { ...c, color: next } : c));
                        }}
                        className="w-5 h-5 rounded-full border border-slate-200"
                        style={{ backgroundColor: cat.color }}
                      />
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="text-slate-300 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 ml-4">
                    {cat.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 group/item">
                        <button
                          onClick={() => toggleItem(cat.id, item.id)}
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                          style={{
                            backgroundColor: cat.color,
                            opacity: item.done ? 1 : 0.5
                          }}
                        >
                          {item.done && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
                        </button>
                        {item.isNew || !item.text ? (
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateItemText(cat.id, item.id, e.target.value)}
                            onBlur={(e) => {
                              if (!e.target.value.trim()) deleteItem(cat.id, item.id);
                              else updateItemText(cat.id, item.id, e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur();
                                if (e.target.value.trim()) addItem(cat.id);
                              }
                            }}
                            autoFocus
                            placeholder="할 일을 입력하세요"
                            className="flex-1 bg-transparent text-slate-700 text-base focus:outline-none border-b border-slate-200 focus:border-slate-400 pb-1"
                            style={{ fontFamily: '"Gaegu", cursive' }}
                          />
                        ) : (
                          <span
                            onClick={() => toggleItem(cat.id, item.id)}
                            className={`flex-1 text-base cursor-pointer transition ${
                              item.done ? 'line-through opacity-50' : ''
                            }`}
                            style={{ color: currentTheme.dark ? '#e2e8f0' : '#334155' }}
                          >
                            {item.text}
                          </span>
                        )}
                        <button
                          onClick={() => deleteItem(cat.id, item.id)}
                          className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addItem(cat.id)}
                      className="flex items-center gap-2 ml-11 text-slate-400 hover:text-slate-600 transition text-sm"
                    >
                      <Plus className="w-4 h-4" /> 항목 추가
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: Time Table */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-3xl font-bold" style={{ color: currentTheme.dark ? '#f1f5f9' : '#1e293b' }}>Time Table</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-slate-200"
                  style={{ backgroundColor: selectedColor }}
                />
                <button
                  onClick={() => setConfirmReset('timetable')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 transition text-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 초기화
                </button>
              </div>
            </div>

            {showColorPicker && (
              <div className="flex gap-2 mb-3 p-3 rounded-2xl shadow-sm" style={{ backgroundColor: currentTheme.card }}>
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      setShowColorPicker(false);
                    }}
                    className={`w-9 h-9 rounded-full transition hover:scale-110 ${
                      selectedColor === c ? 'ring-2 ring-slate-400 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}

            <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: currentTheme.card }}>
              <div className="grid mb-1" style={{ gridTemplateColumns: '50px repeat(6, 1fr)' }}>
                <div></div>
                {[10, 20, 30, 40, 50, 60].map((m) => (
                  <div key={m} className="text-center text-xs font-bold py-1" style={{ color: currentTheme.headerText }}>
                    {m}
                  </div>
                ))}
              </div>

              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid relative"
                  style={{ gridTemplateColumns: '50px repeat(6, 1fr)' }}
                >
                  <div className="text-xs font-bold py-1.5 pr-2 text-right flex items-center justify-end" style={{ color: currentTheme.timeText }}>
                    {hour}:00
                  </div>
                  {/* 빈 셀 그리드 (배경) */}
                  {[0, 1, 2, 3, 4, 5].map((slot) => {
                    const key = `${hour}-${slot}`;
                    return (
                      <div
                        key={slot}
                        onMouseDown={() => {
                          setIsDragging(true);
                          handleCellInteraction(hour, slot, true);
                        }}
                        onMouseEnter={() => isDragging && handleCellInteraction(hour, slot)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                          handleCellInteraction(hour, slot, true);
                        }}
                        onTouchMove={(e) => {
                          e.preventDefault();
                          const touch = e.touches[0];
                          const el = document.elementFromPoint(touch.clientX, touch.clientY);
                          if (el?.dataset?.cellKey) {
                            const [h, s] = el.dataset.cellKey.split('-').map(Number);
                            handleCellInteraction(h, s);
                          }
                        }}
                        data-cell-key={key}
                        className="h-8 cursor-pointer transition-colors"
                        style={{
                          border: `1px solid ${currentTheme.cellBorder}`,
                          backgroundColor: 'transparent'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = currentTheme.cellHover; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      />
                    );
                  })}
                  {/* 병합된 블록 (위에 절대 위치) */}
                  {blocks[hour]?.map((block) => {
                    const span = block.endSlot - block.startSlot + 1;
                    const leftCalc = `calc(50px + ${block.startSlot} * ((100% - 50px) / 6))`;
                    const widthCalc = `calc(${span} * ((100% - 50px) / 6))`;
                    const blockKey = `${hour}-${block.blockId}`;
                    const isEditing = editingBlock === blockKey;

                    return (
                      <div
                        key={block.blockId}
                        className="absolute top-0 h-8 flex items-center justify-center px-1 cursor-pointer overflow-hidden rounded-sm"
                        style={{
                          left: leftCalc,
                          width: widthCalc,
                          backgroundColor: block.color,
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                        onClick={(e) => {
                          if (!isDragging) {
                            e.stopPropagation();
                            setEditingBlock(blockKey);
                          }
                        }}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={block.label}
                            onChange={(e) => updateBlockLabel(block, e.target.value)}
                            onBlur={() => setEditingBlock(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Escape') setEditingBlock(null);
                            }}
                            autoFocus
                            placeholder="과목"
                            className="w-full bg-transparent text-slate-700 text-sm text-center focus:outline-none"
                            style={{ fontFamily: '"Gaegu", cursive' }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span
                            className="text-slate-700 text-sm truncate font-bold"
                            style={{ fontFamily: '"Gaegu", cursive' }}
                          >
                            {block.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <p className={`text-xs mt-3 text-center ${currentTheme.dark ? 'text-slate-400' : 'text-slate-400'}`}>
              💡 드래그로 칠하기 · 색칠된 칸 탭하면 과목 입력 · 같은 색은 자동 병합
            </p>
          </div>
        </div>
      </div>

      {/* 설정 모달 */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-6 h-6" /> 설정
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* 1. 배경 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-slate-600" />
                <h4 className="text-lg font-bold text-slate-700">배경 색깔</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`relative rounded-2xl p-4 h-20 flex items-end justify-center transition ${
                      theme === key
                        ? 'ring-4 ring-indigo-400 scale-105'
                        : 'ring-1 ring-slate-200 hover:scale-105'
                    }`}
                    style={{ background: t.bg }}
                  >
                    <span className={`text-sm font-bold ${t.dark ? 'text-white' : 'text-slate-700'}`}>
                      {t.name}
                    </span>
                    {theme === key && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 색깔 세트 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-slate-600" />
                <h4 className="text-lg font-bold text-slate-700">색깔 세트</h4>
              </div>
              <div className="space-y-2">
                {Object.entries({
                  pastel: '파스텔 (부드러운 색)',
                  vivid: '비비드 (또렷한 색)',
                  ocean: '바다 (시원한 색)',
                  candy: '캔디 (달콤한 색)',
                  forest: '숲 (자연 색)'
                }).map(([key, name]) => {
                  const palettes = {
                    pastel: ['#a8e6e2', '#e8c5e8', '#fcd5ce', '#fde4a6', '#d4f1c5', '#c5d8f1', '#f1c5c5', '#dcc5f1'],
                    vivid:  ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff8c42', '#c780fa', '#00d4aa', '#ff6363'],
                    ocean:  ['#a8dadc', '#457b9d', '#74c0fc', '#1d3557', '#48cae4', '#90e0ef', '#0096c7', '#caf0f8'],
                    candy:  ['#ffafcc', '#ffc8dd', '#cdb4db', '#bde0fe', '#a2d2ff', '#ffd6a5', '#fdffb6', '#caffbf'],
                    forest: ['#a3b18a', '#588157', '#dad7cd', '#bc6c25', '#ddb892', '#e9edc9', '#fefae0', '#ccd5ae'],
                  };
                  const isSelected = palette === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setPalette(key)}
                      className={`w-full p-3 rounded-2xl flex items-center gap-3 transition ${
                        isSelected
                          ? 'bg-indigo-50 ring-2 ring-indigo-400'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex gap-1 flex-shrink-0">
                        {palettes[key].slice(0, 5).map((c, i) => (
                          <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-base font-bold text-slate-700 flex-1 text-left">{name}</span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 글꼴 */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-5 h-5 text-slate-600" />
                <h4 className="text-lg font-bold text-slate-700">글꼴</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(fonts).map(([key, f]) => (
                  <button
                    key={key}
                    onClick={() => setFont(key)}
                    className={`p-4 rounded-2xl transition ${
                      font === key
                        ? 'bg-indigo-50 ring-2 ring-indigo-400'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-2xl text-slate-800 mb-1" style={{ fontFamily: f.body }}>
                      가나다라
                    </div>
                    <div className="text-xs text-slate-500">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 초기화 확인 모달 */}
      {confirmReset && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-6"
          onClick={() => setConfirmReset(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              정말 초기화할까요?
            </h3>
            <p className="text-slate-500 mb-6">
              {confirmReset === 'todo'
                ? 'To-Do List의 모든 카테고리와 항목이 삭제됩니다. 이 작업은 되돌릴 수 없어요.'
                : 'Time Table의 모든 기록이 삭제됩니다. 이 작업은 되돌릴 수 없어요.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (confirmReset === 'todo') resetTodo();
                  else resetTimeTable();
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-400 text-white font-bold hover:bg-rose-500 transition"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function VocabularyPage({ onBack, theme, font }) {
  const [words, setWords] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'flashcard' | 'game' | 'gameResult'
  const [confirmReset, setConfirmReset] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 새 단어 입력 폼
  const [newWord, setNewWord] = useState({ word: '', korean: '', english: '' });

  // 플래시카드 상태
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // 게임 상태
  const [gameSettings, setGameSettings] = useState({
    rounds: 10,
    direction: 'word-to-meaning', // 'word-to-meaning' | 'meaning-to-word'
    filter: 'all' // 'all' | 'starred' | 'unstarred'
  });
  const [gameState, setGameState] = useState(null);
  // gameState: { questions, currentRound, score, answers: [{question, correct, selected, isCorrect}], finished }

  // 데이터 로드
  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.storage.get('vocab-data');
        if (res?.value) {
          const data = JSON.parse(res.value);
          setWords(data.words || []);
        }
      } catch (e) {
        console.error('단어장 로드 실패', e);
      }
      setLoaded(true);
    };
    load();
  }, []);

  // 데이터 저장
  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await window.storage.set('vocab-data', JSON.stringify({ words }));
      } catch (e) {
        console.error('저장 실패', e);
      }
    };
    save();
  }, [words, loaded]);

  // ===== 단어 CRUD =====
  const addWord = () => {
    if (!newWord.word.trim()) return;
    const word = {
      id: Date.now().toString(),
      word: newWord.word.trim(),
      korean: newWord.korean.trim(),
      english: newWord.english.trim(),
      starred: false,
    };
    setWords([word, ...words]);
    setNewWord({ word: '', korean: '', english: '' });
    setShowAddForm(false);
  };

  const updateWord = (id, updates) => {
    setWords(words.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWord = (id) => {
    setWords(words.filter(w => w.id !== id));
  };

  const toggleStar = (id) => {
    setWords(words.map(w => w.id === id ? { ...w, starred: !w.starred } : w));
  };

  // 음성 읽기
  const speak = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // ===== 플래시카드 =====
  const flashcardWords = words;
  const currentCard = flashcardWords[cardIndex];

  const nextCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setCardIndex((i) => (i + 1) % flashcardWords.length);
    }, 150);
  };
  const prevCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setCardIndex((i) => (i - 1 + flashcardWords.length) % flashcardWords.length);
    }, 150);
  };

  // ===== 게임 =====
  const filteredForGame = useMemo(() => {
    if (gameSettings.filter === 'starred') return words.filter(w => w.starred);
    if (gameSettings.filter === 'unstarred') return words.filter(w => !w.starred);
    return words;
  }, [words, gameSettings.filter]);

  const startGame = () => {
    if (filteredForGame.length < 4) return; // 보기 4개 만들려면 최소 4개 필요
    const rounds = Math.min(gameSettings.rounds, filteredForGame.length);
    const shuffled = [...filteredForGame].sort(() => Math.random() - 0.5).slice(0, rounds);

    const questions = shuffled.map((w) => {
      // 정답 외 보기 3개를 다른 단어들에서 랜덤 추출
      const others = filteredForGame
        .filter(o => o.id !== w.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [...others, w].sort(() => Math.random() - 0.5);
      return { word: w, options };
    });

    setGameState({
      questions,
      currentRound: 0,
      score: 0,
      answers: [],
      finished: false,
      selectedOption: null,
      showFeedback: false
    });
    setView('game');
  };

  const selectAnswer = (optionId) => {
    if (gameState.showFeedback) return;
    const q = gameState.questions[gameState.currentRound];
    const isCorrect = optionId === q.word.id;
    const newAnswer = {
      question: q.word,
      selectedId: optionId,
      isCorrect
    };
    setGameState(prev => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      answers: [...prev.answers, newAnswer],
      selectedOption: optionId,
      showFeedback: true
    }));
  };

  const nextQuestion = () => {
    setGameState(prev => {
      const isLast = prev.currentRound >= prev.questions.length - 1;
      if (isLast) {
        return { ...prev, finished: true, showFeedback: false, selectedOption: null };
      }
      return {
        ...prev,
        currentRound: prev.currentRound + 1,
        selectedOption: null,
        showFeedback: false
      };
    });
  };

  // 게임 종료 시 자동으로 결과 화면으로
  useEffect(() => {
    if (gameState?.finished && view === 'game') {
      setView('gameResult');
    }
  }, [gameState?.finished, view]);

  // 초기화
  const resetAll = () => {
    setWords([]);
    setConfirmReset(false);
  };

  // ===== 렌더링 =====
  const isDark = theme.dark;
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const subTextColor = isDark ? '#cbd5e1' : '#64748b';

  return (
    <div
      className="min-h-screen w-full select-none"
      style={{
        background: theme.bg,
        fontFamily: font.body,
        color: textColor
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 상단 바 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition text-slate-700 font-bold"
          >
            <ArrowLeft className="w-5 h-5" /> 플래너로
          </button>
          <h1
            className="text-4xl"
            style={{ fontFamily: font.display, fontWeight: 700, color: textColor }}
          >
            📚 단어장
          </h1>
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 transition text-sm"
          >
            <RotateCcw className="w-4 h-4" /> 초기화
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ backgroundColor: theme.accent }}>
          {[
            { key: 'list', label: '목록', icon: Pencil },
            { key: 'flashcard', label: '카드', icon: BookOpen },
            { key: 'game', label: '게임', icon: Gamepad2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'flashcard' && words.length === 0) return;
                if (key === 'game') {
                  setGameState(null);
                  setView('game');
                  return;
                }
                if (key === 'flashcard') setCardIndex(0);
                setView(key);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${
                view === key || (view === 'gameResult' && key === 'game')
                  ? 'bg-white shadow-md text-slate-700'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
              style={{ color: (view === key || (view === 'gameResult' && key === 'game')) ? '#334155' : theme.accentText }}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* ===== 목록 뷰 ===== */}
        {view === 'list' && (
          <div>
            {/* 추가 버튼/폼 */}
            {showAddForm ? (
              <div className="rounded-2xl p-5 mb-4 shadow-sm" style={{ backgroundColor: theme.card }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    placeholder="영단어"
                    autoFocus
                    className="px-4 py-3 rounded-xl bg-white text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    style={{ fontFamily: font.body }}
                  />
                  <input
                    type="text"
                    value={newWord.korean}
                    onChange={(e) => setNewWord({ ...newWord, korean: e.target.value })}
                    placeholder="한글 뜻"
                    className="px-4 py-3 rounded-xl bg-white text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    style={{ fontFamily: font.body }}
                  />
                  <input
                    type="text"
                    value={newWord.english}
                    onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                    placeholder="영어 뜻 (선택)"
                    className="px-4 py-3 rounded-xl bg-white text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    onKeyDown={(e) => e.key === 'Enter' && addWord()}
                    style={{ fontFamily: font.body }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setShowAddForm(false); setNewWord({ word: '', korean: '', english: '' }); }}
                    className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={addWord}
                    className="px-5 py-2 rounded-xl bg-indigo-400 text-white font-bold hover:bg-indigo-500"
                  >
                    추가
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mb-4 py-4 rounded-2xl border-2 border-dashed transition flex items-center justify-center gap-2 font-bold"
                style={{
                  borderColor: theme.accent,
                  color: theme.accentText,
                  backgroundColor: theme.card + '80'
                }}
              >
                <Plus className="w-5 h-5" /> 새 단어 추가
              </button>
            )}

            {/* 단어 목록 (테이블) */}
            {words.length === 0 ? (
              <div className="text-center py-16" style={{ color: subTextColor }}>
                <p className="text-lg">아직 단어가 없어요</p>
                <p className="text-sm mt-2">위 버튼을 눌러 첫 단어를 추가해보세요!</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: theme.card }}>
                {/* 헤더 */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 font-bold text-sm" style={{ backgroundColor: theme.accent, color: theme.accentText }}>
                  <div className="col-span-1 text-center">⭐</div>
                  <div className="col-span-3">단어</div>
                  <div className="col-span-3">한글 뜻</div>
                  <div className="col-span-4">영어 뜻</div>
                  <div className="col-span-1"></div>
                </div>
                {/* 행들 */}
                <div className="divide-y" style={{ borderColor: theme.cellBorder }}>
                  {words.map((w) => (
                    <WordRow
                      key={w.id}
                      word={w}
                      theme={theme}
                      font={font}
                      isEditing={editingWord === w.id}
                      onEdit={() => setEditingWord(w.id)}
                      onCancelEdit={() => setEditingWord(null)}
                      onSave={(updates) => { updateWord(w.id, updates); setEditingWord(null); }}
                      onDelete={() => deleteWord(w.id)}
                      onToggleStar={() => toggleStar(w.id)}
                      onSpeak={() => speak(w.word)}
                    />
                  ))}
                </div>
              </div>
            )}

            {words.length > 0 && (
              <div className="mt-4 text-center text-sm" style={{ color: subTextColor }}>
                총 {words.length}개 · ⭐ {words.filter(w => w.starred).length}개
              </div>
            )}
          </div>
        )}

        {/* ===== 플래시카드 뷰 ===== */}
        {view === 'flashcard' && words.length > 0 && currentCard && (
          <div className="flex flex-col items-center">
            <div className="text-sm mb-3" style={{ color: subTextColor }}>
              {cardIndex + 1} / {flashcardWords.length}
            </div>

            <div
              className="w-full max-w-2xl h-80 rounded-3xl shadow-lg cursor-pointer flex items-center justify-center p-8 mb-6 transition-transform"
              style={{
                backgroundColor: theme.card,
                transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.3s'
              }}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              <div style={{ transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }} className="text-center">
                {!cardFlipped ? (
                  <div>
                    <div className="text-5xl font-bold mb-3" style={{ color: textColor, fontFamily: font.body }}>
                      {currentCard.word}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentCard.word); }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
                    >
                      <Volume2 className="w-5 h-5" /> 듣기
                    </button>
                    <div className="text-sm mt-6" style={{ color: subTextColor }}>
                      탭하면 뜻이 보여요
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: textColor, fontFamily: font.body }}>
                      {currentCard.korean || '(한글 뜻 없음)'}
                    </div>
                    {currentCard.english && (
                      <div className="text-lg mt-3" style={{ color: subTextColor, fontFamily: font.body }}>
                        {currentCard.english}
                      </div>
                    )}
                    <div className="text-sm mt-6" style={{ color: subTextColor }}>
                      탭하면 단어로 돌아가요
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={prevCard}
                className="w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-slate-600"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={() => toggleStar(currentCard.id)}
                className="w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition"
              >
                <Star
                  className="w-7 h-7"
                  fill={currentCard.starred ? '#fbbf24' : 'none'}
                  stroke={currentCard.starred ? '#fbbf24' : '#94a3b8'}
                />
              </button>
              <button
                onClick={nextCard}
                className="w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-slate-600"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}

        {view === 'flashcard' && words.length === 0 && (
          <div className="text-center py-20" style={{ color: subTextColor }}>
            <p className="text-lg mb-2">먼저 단어를 추가해주세요!</p>
            <button
              onClick={() => setView('list')}
              className="mt-4 px-6 py-3 rounded-2xl bg-indigo-400 text-white font-bold"
            >
              단어 추가하러 가기
            </button>
          </div>
        )}

        {/* ===== 게임 시작 화면 ===== */}
        {view === 'game' && !gameState && (
          <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: theme.card }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: textColor }}>
              🎮 영단어 게임
            </h2>

            {words.length < 4 ? (
              <div className="text-center" style={{ color: subTextColor }}>
                <p className="text-lg mb-4">단어가 최소 4개 필요해요</p>
                <p>현재 {words.length}개</p>
                <button
                  onClick={() => setView('list')}
                  className="mt-6 px-6 py-3 rounded-2xl bg-indigo-400 text-white font-bold"
                >
                  단어 추가하기
                </button>
              </div>
            ) : (
              <>
                {/* 라운드 수 */}
                <div className="mb-6">
                  <label className="block font-bold mb-3" style={{ color: textColor }}>
                    몇 문제 풀까요?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 20, 30].map(n => (
                      <button
                        key={n}
                        onClick={() => setGameSettings({ ...gameSettings, rounds: n })}
                        disabled={n > words.length}
                        className={`py-3 rounded-xl font-bold transition ${
                          gameSettings.rounds === n
                            ? 'bg-indigo-400 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        {n}문제
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: subTextColor }}>
                    (전체 단어 수: {words.length}개)
                  </p>
                </div>

                {/* 출제 방향 */}
                <div className="mb-6">
                  <label className="block font-bold mb-3" style={{ color: textColor }}>
                    어떻게 풀까요?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setGameSettings({ ...gameSettings, direction: 'word-to-meaning' })}
                      className={`py-3 rounded-xl font-bold transition ${
                        gameSettings.direction === 'word-to-meaning'
                          ? 'bg-indigo-400 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      영어 → 뜻
                    </button>
                    <button
                      onClick={() => setGameSettings({ ...gameSettings, direction: 'meaning-to-word' })}
                      className={`py-3 rounded-xl font-bold transition ${
                        gameSettings.direction === 'meaning-to-word'
                          ? 'bg-indigo-400 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      뜻 → 영어
                    </button>
                  </div>
                </div>

                {/* 단어 범위 */}
                <div className="mb-6">
                  <label className="block font-bold mb-3" style={{ color: textColor }}>
                    어떤 단어로 풀까요?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setGameSettings({ ...gameSettings, filter: 'all' })}
                      className={`py-3 rounded-xl font-bold text-sm transition ${
                        gameSettings.filter === 'all'
                          ? 'bg-indigo-400 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      전체 ({words.length})
                    </button>
                    <button
                      onClick={() => setGameSettings({ ...gameSettings, filter: 'starred' })}
                      disabled={words.filter(w => w.starred).length < 4}
                      className={`py-3 rounded-xl font-bold text-sm transition ${
                        gameSettings.filter === 'starred'
                          ? 'bg-indigo-400 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } disabled:opacity-30`}
                    >
                      ⭐ ({words.filter(w => w.starred).length})
                    </button>
                    <button
                      onClick={() => setGameSettings({ ...gameSettings, filter: 'unstarred' })}
                      disabled={words.filter(w => !w.starred).length < 4}
                      className={`py-3 rounded-xl font-bold text-sm transition ${
                        gameSettings.filter === 'unstarred'
                          ? 'bg-indigo-400 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } disabled:opacity-30`}
                    >
                      안외움 ({words.filter(w => !w.starred).length})
                    </button>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  disabled={filteredForGame.length < 4}
                  className="w-full py-4 rounded-2xl bg-indigo-400 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg transition disabled:opacity-30"
                >
                  🚀 게임 시작!
                </button>
              </>
            )}
          </div>
        )}

        {/* ===== 게임 진행 화면 ===== */}
        {view === 'game' && gameState && !gameState.finished && (
          <GameQuestion
            gameState={gameState}
            settings={gameSettings}
            theme={theme}
            font={font}
            textColor={textColor}
            subTextColor={subTextColor}
            onSelect={selectAnswer}
            onNext={nextQuestion}
            onQuit={() => { setGameState(null); setView('game'); }}
            speak={speak}
          />
        )}

        {/* ===== 게임 결과 화면 ===== */}
        {view === 'gameResult' && gameState && (
          <GameResult
            gameState={gameState}
            theme={theme}
            font={font}
            textColor={textColor}
            subTextColor={subTextColor}
            onPlayAgain={() => { setGameState(null); }}
            onBackToList={() => { setGameState(null); setView('list'); }}
          />
        )}

      </div>

      {/* 초기화 확인 */}
      {confirmReset && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-6"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-3">정말 초기화할까요?</h3>
            <p className="text-slate-500 mb-6">모든 단어가 삭제됩니다. 이 작업은 되돌릴 수 없어요.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                취소
              </button>
              <button
                onClick={resetAll}
                className="flex-1 py-3 rounded-2xl bg-rose-400 text-white font-bold hover:bg-rose-500"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== 단어 행 =====
function WordRow({ word, theme, font, isEditing, onEdit, onCancelEdit, onSave, onDelete, onToggleStar, onSpeak }) {
  const [edit, setEdit] = useState({ word: word.word, korean: word.korean, english: word.english });

  useEffect(() => {
    if (isEditing) setEdit({ word: word.word, korean: word.korean, english: word.english });
  }, [isEditing, word]);

  if (isEditing) {
    return (
      <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center bg-indigo-50">
        <div className="col-span-1"></div>
        <input
          type="text"
          value={edit.word}
          onChange={(e) => setEdit({ ...edit, word: e.target.value })}
          className="col-span-3 px-3 py-2 rounded-lg bg-white text-slate-700 focus:outline-none"
          style={{ fontFamily: font.body }}
          autoFocus
        />
        <input
          type="text"
          value={edit.korean}
          onChange={(e) => setEdit({ ...edit, korean: e.target.value })}
          className="col-span-3 px-3 py-2 rounded-lg bg-white text-slate-700 focus:outline-none"
          style={{ fontFamily: font.body }}
        />
        <input
          type="text"
          value={edit.english}
          onChange={(e) => setEdit({ ...edit, english: e.target.value })}
          className="col-span-4 px-3 py-2 rounded-lg bg-white text-slate-700 focus:outline-none"
          style={{ fontFamily: font.body }}
          onKeyDown={(e) => e.key === 'Enter' && onSave(edit)}
        />
        <div className="col-span-1 flex gap-1 justify-end">
          <button onClick={() => onSave(edit)} className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={onCancelEdit} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50 group cursor-pointer transition" onClick={onEdit}>
      <div className="col-span-1 flex justify-center">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
          className="hover:scale-110 transition"
        >
          <Star
            className="w-5 h-5"
            fill={word.starred ? '#fbbf24' : 'none'}
            stroke={word.starred ? '#fbbf24' : '#cbd5e1'}
          />
        </button>
      </div>
      <div className="col-span-3 flex items-center gap-2">
        <span className="font-bold text-slate-700 text-lg" style={{ fontFamily: font.body }}>
          {word.word}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onSpeak(); }}
          className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-600 transition"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <div className="col-span-3 text-slate-600" style={{ fontFamily: font.body }}>
        {word.korean || <span className="text-slate-300">(없음)</span>}
      </div>
      <div className="col-span-4 text-slate-500 text-sm" style={{ fontFamily: font.body }}>
        {word.english || <span className="text-slate-300">(없음)</span>}
      </div>
      <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-slate-300 hover:text-rose-400 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== 게임 문제 화면 =====
function GameQuestion({ gameState, settings, theme, font, textColor, subTextColor, onSelect, onNext, onQuit, speak }) {
  const q = gameState.questions[gameState.currentRound];
  const total = gameState.questions.length;
  const isWordToMeaning = settings.direction === 'word-to-meaning';

  const getQuestionText = (w) => isWordToMeaning ? w.word : (w.korean || w.english || w.word);
  const getOptionText = (w) => isWordToMeaning ? (w.korean || w.english || w.word) : w.word;

  return (
    <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: theme.card }}>
      {/* 진행도 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="font-bold" style={{ color: textColor }}>
            {gameState.currentRound + 1} / {total}
          </span>
          <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-bold">
            {gameState.score}점
          </span>
        </div>
        <button
          onClick={onQuit}
          className="text-sm text-slate-400 hover:text-slate-600"
        >
          그만두기
        </button>
      </div>

      {/* 진행 바 */}
      <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-indigo-400 transition-all"
          style={{ width: `${((gameState.currentRound + 1) / total) * 100}%` }}
        />
      </div>

      {/* 문제 */}
      <div className="text-center mb-8">
        <p className="text-sm mb-3" style={{ color: subTextColor }}>
          {isWordToMeaning ? '이 단어의 뜻은?' : '이 뜻에 맞는 영단어는?'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <h2
            className="text-5xl font-bold"
            style={{ color: textColor, fontFamily: font.body }}
          >
            {getQuestionText(q.word)}
          </h2>
          {isWordToMeaning && (
            <button
              onClick={() => speak(q.word.word)}
              className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* 보기 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {q.options.map((opt, idx) => {
          const isSelected = gameState.selectedOption === opt.id;
          const isCorrect = opt.id === q.word.id;
          const showResult = gameState.showFeedback;

          let bgColor = 'bg-slate-50 hover:bg-slate-100';
          let borderColor = 'border-transparent';
          if (showResult) {
            if (isCorrect) {
              bgColor = 'bg-emerald-100';
              borderColor = 'border-emerald-400';
            } else if (isSelected) {
              bgColor = 'bg-rose-100';
              borderColor = 'border-rose-400';
            } else {
              bgColor = 'bg-slate-50 opacity-50';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              disabled={gameState.showFeedback}
              className={`p-5 rounded-2xl border-2 ${bgColor} ${borderColor} transition text-lg text-left flex items-center justify-between`}
              style={{ fontFamily: font.body }}
            >
              <span className="text-slate-700 font-bold">
                {String.fromCharCode(65 + idx)}. {getOptionText(opt)}
              </span>
              {showResult && isCorrect && <Check className="w-5 h-5 text-emerald-500" />}
              {showResult && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-500" />}
            </button>
          );
        })}
      </div>

      {/* 다음 버튼 */}
      {gameState.showFeedback && (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl bg-indigo-400 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg transition"
        >
          {gameState.currentRound >= total - 1 ? '결과 보기 🎉' : '다음 문제 →'}
        </button>
      )}
    </div>
  );
}

// ===== 게임 결과 화면 =====
function GameResult({ gameState, theme, font, textColor, subTextColor, onPlayAgain, onBackToList }) {
  const total = gameState.questions.length;
  const score = gameState.score;
  const percent = Math.round((score / total) * 100);
  const wrong = gameState.answers.filter(a => !a.isCorrect);

  let emoji = '🎉';
  let message = '완벽해요!';
  if (percent < 60) { emoji = '💪'; message = '다시 도전해봐요!'; }
  else if (percent < 80) { emoji = '👍'; message = '잘했어요!'; }
  else if (percent < 100) { emoji = '🌟'; message = '훌륭해요!'; }

  return (
    <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: theme.card }}>
      <div className="text-center mb-8">
        <div className="text-7xl mb-3">{emoji}</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>{message}</h2>
        <div className="text-6xl font-bold my-4 text-indigo-500">
          {score} / {total}
        </div>
        <p style={{ color: subTextColor }}>{percent}점</p>
      </div>

      {/* 오답 노트 */}
      {wrong.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: textColor }}>
            <Pencil className="w-5 h-5" /> 다시 봐야 할 단어 ({wrong.length}개)
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {wrong.map((a, i) => (
              <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                <div className="font-bold text-slate-700" style={{ fontFamily: font.body }}>
                  {a.question.word}
                </div>
                <div className="text-sm text-slate-500 mt-1" style={{ fontFamily: font.body }}>
                  {a.question.korean} {a.question.english && `· ${a.question.english}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBackToList}
          className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
        >
          단어장으로
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 rounded-2xl bg-indigo-400 text-white font-bold hover:bg-indigo-500 flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5" /> 다시 도전!
        </button>
      </div>
    </div>
  );
}
