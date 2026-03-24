const { useState, useEffect, useCallback } = React;

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const PROGRAM = {
  1: { name: "Push (Poitrine, Épaules, Triceps)", emoji: "🔴", exercises: [
    { name: "Développé couché machine", sets: 3, reps: "10-12", muscle: "Pectoraux" },
    { name: "Pec fly machine", sets: 3, reps: "12-15", muscle: "Pectoraux" },
    { name: "Converging shoulder press", sets: 3, reps: "10-12", muscle: "Épaules" },
    { name: "Triceps pushdown câble", sets: 3, reps: "12-15", muscle: "Triceps" },
    { name: "Développé incliné haltères", sets: 3, reps: "10-12", muscle: "Pectoraux haut" },
    { name: "Élévations latérales", sets: 3, reps: "12-15", muscle: "Épaules" },
  ]},
  2: { name: "Pull (Dos, Biceps)", emoji: "🔵", exercises: [
    { name: "Tirage vertical machine", sets: 3, reps: "10-12", muscle: "Dos (largeur)" },
    { name: "Rowing machine", sets: 3, reps: "10-12", muscle: "Dos (épaisseur)" },
    { name: "Tirage horizontal câble", sets: 3, reps: "12-15", muscle: "Dos" },
    { name: "Face pull câble", sets: 3, reps: "15", muscle: "Arrière épaules" },
    { name: "Curl biceps machine", sets: 3, reps: "12-15", muscle: "Biceps" },
    { name: "Curl marteau haltères", sets: 3, reps: "12", muscle: "Biceps" },
  ]},
  3: { name: "Jambes (Quadriceps, Ischios, Fessiers)", emoji: "🟢", exercises: [
    { name: "Presse à cuisses", sets: 3, reps: "10-12", muscle: "Quadriceps" },
    { name: "Leg extension", sets: 3, reps: "12-15", muscle: "Quadriceps" },
    { name: "Leg curl allongé", sets: 3, reps: "12-15", muscle: "Ischios" },
    { name: "Hip thrust machine", sets: 3, reps: "10-12", muscle: "Fessiers" },
    { name: "Mollets debout machine", sets: 3, reps: "15-20", muscle: "Mollets" },
    { name: "Fentes avec haltères", sets: 3, reps: "10/jambe", muscle: "Jambes" },
  ]},
  4: { name: "Full Body + Core", emoji: "🟡", exercises: [
    { name: "Squat goblet haltère", sets: 3, reps: "12", muscle: "Jambes" },
    { name: "Rowing un bras haltère", sets: 3, reps: "10/côté", muscle: "Dos" },
    { name: "Développé incliné machine", sets: 3, reps: "12", muscle: "Pectoraux" },
    { name: "Planche", sets: 3, reps: "30-45s", muscle: "Core" },
    { name: "Crunch machine", sets: 3, reps: "15", muscle: "Abdos" },
    { name: "Gainage latéral", sets: 2, reps: "20s/côté", muscle: "Obliques" },
  ]},
  5: { name: "Cardio", emoji: "🏃", type: "cardio", exercises: [] },
};

const WEEKLY_PLAN = { 1: 1, 2: 2, 4: 3, 5: 4 };

const ACHIEVEMENTS_DEF = [
  { id: "first", name: "Premier pas", desc: "Première séance", icon: "🌱", cond: (s) => s.total >= 1 },
  { id: "week1", name: "Semaine bouclée", desc: "4 séances en 1 semaine", icon: "⭐", cond: (s) => s.maxWeek >= 4 },
  { id: "ten", name: "Dix de der", desc: "10 séances", icon: "🔥", cond: (s) => s.total >= 10 },
  { id: "streak3", name: "Régulier", desc: "3 semaines d'affilée", icon: "💎", cond: (s) => s.streak >= 3 },
  { id: "twenty", name: "Accro", desc: "20 séances", icon: "🏆", cond: (s) => s.total >= 20 },
  { id: "month", name: "1 mois !", desc: "4 semaines actives", icon: "👑", cond: (s) => s.weeks >= 4 },
  { id: "fifty", name: "Légende", desc: "50 séances", icon: "🦾", cond: (s) => s.total >= 50 },
  { id: "streak8", name: "Inarrêtable", desc: "8 semaines d'affilée", icon: "💫", cond: (s) => s.streak >= 8 },
];

const MEAS_FIELDS = [
  { key: "chest", label: "Poitrine" }, { key: "waist", label: "Taille" }, { key: "hips", label: "Hanches" },
  { key: "armL", label: "Bras G" }, { key: "armR", label: "Bras D" }, { key: "thighL", label: "Cuisse G" }, { key: "thighR", label: "Cuisse D" },
];

// Calorie targets: 2450 kcal, ~180g protein, ~80g fat, ~280g carbs
const CALORIE_TARGET = 2450;
const MACRO_TARGETS = { protein: 180, fat: 80, carbs: 280 };

const COMMON_FOODS = [
  { name: "Poulet grillé (100g)", cal: 165, protein: 31, fat: 3.6, carbs: 0 },
  { name: "Riz complet cuit (100g)", cal: 123, protein: 2.7, fat: 1, carbs: 26 },
  { name: "Œuf entier", cal: 78, protein: 6, fat: 5, carbs: 0.6 },
  { name: "Flocons d'avoine (40g)", cal: 150, protein: 5, fat: 2.7, carbs: 27 },
  { name: "Banane", cal: 89, protein: 1.1, fat: 0.3, carbs: 23 },
  { name: "Fromage blanc 0% (100g)", cal: 46, protein: 7, fat: 0.2, carbs: 3.5 },
  { name: "Saumon (100g)", cal: 208, protein: 20, fat: 13, carbs: 0 },
  { name: "Pâtes cuites (100g)", cal: 131, protein: 5, fat: 1.1, carbs: 25 },
  { name: "Pain complet (tranche)", cal: 80, protein: 4, fat: 1, carbs: 14 },
  { name: "Beurre de cacahuète (15g)", cal: 94, protein: 4, fat: 8, carbs: 2 },
  { name: "Amandes (30g)", cal: 173, protein: 6, fat: 15, carbs: 3 },
  { name: "Patate douce (100g)", cal: 86, protein: 1.6, fat: 0.1, carbs: 20 },
  { name: "Whey protéine (30g)", cal: 120, protein: 24, fat: 1.5, carbs: 3 },
  { name: "Steak haché 5% (100g)", cal: 137, protein: 21, fat: 5, carbs: 0 },
  { name: "Avocat (demi)", cal: 120, protein: 1.5, fat: 11, carbs: 6 },
  { name: "Lentilles cuites (100g)", cal: 116, protein: 9, fat: 0.4, carbs: 20 },
  { name: "Yaourt grec (100g)", cal: 97, protein: 9, fat: 5, carbs: 3.6 },
  { name: "Thon en boîte (100g)", cal: 116, protein: 26, fat: 1, carbs: 0 },
  { name: "Huile d'olive (1 c.s.)", cal: 119, protein: 0, fat: 14, carbs: 0 },
  { name: "Pomme", cal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { name: "Hi-Pro framboise (Danone)", cal: 160, protein: 25, fat: 2, carbs: 4 },
  { name: "Café au lait", cal: 50, protein: 3, fat: 2, carbs: 5 },
  { name: "Jus d'orange (verre)", cal: 90, protein: 1, fat: 0, carbs: 22 },
  { name: "Crunch (plaquette)", cal: 210, protein: 3, fat: 11, carbs: 25 },
  { name: "Endive (100g)", cal: 17, protein: 1, fat: 0, carbs: 3 },
];

const MEAL_TYPES = ["Petit-déj", "Déjeuner", "Collation", "Dîner", "Snack"];

const SK = "fitness-tracker-v4";

const SEED_DATA = {
  sessions: [
  {
    date: "2026-03-16",
    workoutId: 1,
    exercises: [
      { name: "Développé couché machine", sets: 3, reps: "12", weight: "25" },
      { name: "Développé incliné haltères", sets: 3, reps: "12", weight: "8" },
      { name: "Élévations latérales", sets: 3, reps: "12", weight: "5" },
      { name: "Pec fly machine", sets: 3, reps: "12", weight: "25" },
      { name: "Converging shoulder press", sets: 3, reps: "12-12-11", weight: "14" },
    ],
    feeling: 3,
    notes: "Jour 1. Condition agencée. Mort à la 2ème série d'élévations latérales. Douleur coude gauche au pec fly (corrigé en pliant plus les coudes). Triceps pushdown skip (poulie prise). 10 min vélo A/R.",
    ts: 1742220000000,
  }],
  weightLog: [{ date: "2026-03-16", weight: 76.2 }],
  measurements: [],
  meals: [
    { name: "Café au lait", cal: 50, protein: 3, fat: 2, carbs: 5, date: "2026-03-16", meal: "Petit-déj", ts: 1742112000000 },
    { name: "Jus d'orange", cal: 90, protein: 1, fat: 0, carbs: 22, date: "2026-03-16", meal: "Petit-déj", ts: 1742112001000 },
    { name: "Hi-Pro framboise", cal: 160, protein: 25, fat: 2, carbs: 4, date: "2026-03-16", meal: "Collation", ts: 1742122800000 },
  ],
};

function App() {
  const [data, setData] = useState({ sessions: [], weightLog: [], measurements: [], meals: [] });
  const [view, setView] = useState("home");
  const [selectedDay, setSelectedDay] = useState(null);
  const [logForm, setLogForm] = useState(null);
  const [notif, setNotif] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tTab, setTTab] = useState("perf");
  const [tExercise, setTExercise] = useState(null);
  const [weightForm, setWeightForm] = useState("");
  const [measForm, setMeasForm] = useState({});
  // Nutrition state
  const [mealType, setMealType] = useState("Déjeuner");
  const [foodSearch, setFoodSearch] = useState("");
  const [customFood, setCustomFood] = useState({ name: "", cal: "", protein: "", fat: "", carbs: "" });
  const [showCustom, setShowCustom] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState("");
  const [customExercises, setCustomExercises] = useState({});
  const [showAddExercise, setShowAddExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({ name: "", muscle: "", sets: 3, reps: "10-12" });
  const [customWorkouts, setCustomWorkouts] = useState({});
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: "", emoji: "⚪", exercises: [] });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState(WEEKLY_PLAN);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [swipedExercise, setSwipedExercise] = useState(null);
  const [appTitle, setAppTitle] = useState("Mon fitness");
  const [editingTitle, setEditingTitle] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseMedia, setExerciseMedia] = useState({});
  const [addingMediaTo, setAddingMediaTo] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState("");

  const { sessions, weightLog, measurements, meals } = data;

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(SK);
        if (r?.value) { 
          const p = JSON.parse(r.value); 
          setData({ sessions: p.sessions||[], weightLog: p.weightLog||[], measurements: p.measurements||[], meals: p.meals||[] }); 
          setWeeklySchedule(p.weeklySchedule || WEEKLY_PLAN);
          setCustomExercises(p.customExercises || {});
          setCustomWorkouts(p.customWorkouts || {});
          setAppTitle(p.appTitle || "Mon fitness");
          setExerciseMedia(p.exerciseMedia || {});
        }
        else { setData(SEED_DATA); }
      } catch(e){ setData(SEED_DATA); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => { 
      try { 
        await window.storage.set(SK, JSON.stringify({
          ...data,
          weeklySchedule,
          customExercises,
          customWorkouts,
          appTitle,
          exerciseMedia
        })); 
      } catch(e){} 
    })();
  }, [data, loaded, weeklySchedule, customExercises, customWorkouts, appTitle, exerciseMedia]);

  const notify = (m) => { setNotif(m); setTimeout(() => setNotif(null), 3000); };
  const upd = (p) => setData((d) => ({ ...d, ...p }));

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const dow = today.getDay();

  const stats = useCallback(() => {
    const total = sessions.length; const wm = {}; let maxWeek = 0, weeks = 0;
    sessions.forEach((s) => { const d = new Date(s.date); const ws = new Date(d); ws.setDate(d.getDate()-d.getDay()); const k = ws.toISOString().split("T")[0]; wm[k]=(wm[k]||0)+1; });
    Object.values(wm).forEach((c) => { if(c>maxWeek)maxWeek=c; if(c>=1)weeks++; });
    let streak=0; const sw=Object.keys(wm).sort(); for(let i=sw.length-1;i>=0;i--){if(wm[sw[i]]>=3)streak++;else break;}
    return { total, maxWeek, weeks, streak };
  }, [sessions])();

  const unlocked = ACHIEVEMENTS_DEF.filter((a) => a.cond(stats));
  const todaySess = sessions.find((s) => s.date === todayStr);
  const todayPlan = weeklySchedule[dow];

  // Today's meals
  const todayMeals = meals.filter((m) => m.date === todayStr);
  const todayCal = todayMeals.reduce((s, m) => s + (m.cal || 0), 0);
  const todayP = todayMeals.reduce((s, m) => s + (m.protein || 0), 0);
  const todayF = todayMeals.reduce((s, m) => s + (m.fat || 0), 0);
  const todayC = todayMeals.reduce((s, m) => s + (m.carbs || 0), 0);

  const getExHist = useCallback((name) => {
    const h = []; sessions.forEach((s) => { s.exercises?.forEach((e) => { if(e.name===name && e.weight) h.push({date:s.date,sets:e.sets,reps:e.reps,weight:e.weight}); }); });
    return h.sort((a,b)=>a.date.localeCompare(b.date));
  }, [sessions]);

  const calDays = () => {
    const y=today.getFullYear(),mo=today.getMonth(),f=new Date(y,mo,1),l=new Date(y,mo+1,0),ds=[];
    for(let i=0;i<f.getDay();i++)ds.push(null);
    for(let d=1;d<=l.getDate();d++){
      const dt=`${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const dayOfWeek = new Date(y,mo,d).getDay();
      ds.push({day:d,dateStr:dt,session:sessions.find(s=>s.date===dt),planned:weeklySchedule[dayOfWeek],isPast:new Date(y,mo,d)<new Date(y,mo,today.getDate()),isToday:dt===todayStr});
    }
    return ds;
  };

  const startLog = (wId, date) => {
    let allExercises = [];
    if (PROGRAM[wId]) {
      allExercises = [...PROGRAM[wId].exercises, ...(customExercises[wId] || [])];
    } else if (customWorkouts[wId]) {
      allExercises = [...customWorkouts[wId].exercises];
    }
    setLogForm({ workoutId:wId, date:date||todayStr, exercises:allExercises.map(e=>({...e,done:true,actualSets:e.sets,actualReps:e.reps,weight:""})), feeling:3, notes:"" });
    setView("log");
  };

  const saveLog = () => {
    if(!logForm) return;
    const ns = { 
      date:logForm.date, 
      workoutId:logForm.workoutId, 
      workoutName: customWorkouts[logForm.workoutId]?.name || PROGRAM[logForm.workoutId]?.name,
      exercises:logForm.exercises.filter(e=>e.done).map(e=>({name:e.name,sets:e.actualSets,reps:e.actualReps,weight:e.weight})), 
      feeling:logForm.feeling, 
      notes:logForm.notes, 
      ts:Date.now() 
    };
    const u=[...sessions]; const i=u.findIndex(s=>s.date===logForm.date); if(i>=0)u[i]=ns; else u.push(ns);
    upd({sessions:u}); setLogForm(null); setView("home"); notify("Séance enregistrée !");
  };

  const saveWeight = () => { const v=parseFloat(weightForm); if(isNaN(v)||v<=0)return; const u=[...weightLog]; const i=u.findIndex(w=>w.date===todayStr); if(i>=0)u[i]={date:todayStr,weight:v}; else u.push({date:todayStr,weight:v}); upd({weightLog:u.sort((a,b)=>a.date.localeCompare(b.date))}); setWeightForm(""); notify("Poids enregistré !"); };

  const saveMeas = () => { if(!Object.values(measForm).some(v=>v&&parseFloat(v)>0))return; const u=[...measurements]; const i=u.findIndex(m=>m.date===todayStr); if(i>=0)u[i]={date:todayStr,...measForm}; else u.push({date:todayStr,...measForm}); upd({measurements:u.sort((a,b)=>a.date.localeCompare(b.date))}); setMeasForm({}); notify("Mensurations enregistrées !"); };

  const addMeal = (food) => {
    const entry = { ...food, date: todayStr, meal: mealType, ts: Date.now() };
    upd({ meals: [...meals, entry] });
    notify(`${food.name} ajouté !`);
  };

  const addCustomMeal = () => {
    const cal = parseFloat(customFood.cal);
    if (!customFood.name || isNaN(cal)) return;
    addMeal({ name: customFood.name, cal, protein: parseFloat(customFood.protein)||0, fat: parseFloat(customFood.fat)||0, carbs: parseFloat(customFood.carbs)||0 });
    setCustomFood({ name: "", cal: "", protein: "", fat: "", carbs: "" });
    setShowCustom(false);
  };

  const removeMeal = (ts) => { upd({ meals: meals.filter((m) => m.ts !== ts) }); notify("Supprimé"); };

  const importSessions = () => {
    try {
      const imported = JSON.parse(importData);
      if (!imported.sessions || !Array.isArray(imported.sessions)) {
        notify("Format invalide !");
        return;
      }
      const newSessions = [...sessions];
      imported.sessions.forEach(s => {
        const exists = newSessions.findIndex(existing => existing.date === s.date);
        if (exists >= 0) {
          newSessions[exists] = s;
        } else {
          newSessions.push(s);
        }
      });
      upd({ sessions: newSessions });
      setImportData("");
      setShowImport(false);
      notify(`${imported.sessions.length} séance(s) importée(s) !`);
    } catch (e) {
      notify("Erreur d'import !");
    }
  };

  const exportData = () => {
    const dataToExport = { sessions, weightLog, measurements, meals };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-backup-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Données exportées !");
  };

  const addCustomExercise = (workoutId) => {
    if (!newExercise.name || !newExercise.muscle) return;
    const updated = { ...customExercises };
    if (!updated[workoutId]) updated[workoutId] = [];
    updated[workoutId].push({ ...newExercise });
    setCustomExercises(updated);
    setNewExercise({ name: "", muscle: "", sets: 3, reps: "10-12" });
    setShowAddExercise(null);
    notify("Exercice ajouté !");
  };

  const removeCustomExercise = (workoutId, index) => {
    const updated = { ...customExercises };
    updated[workoutId].splice(index, 1);
    if (updated[workoutId].length === 0) delete updated[workoutId];
    setCustomExercises(updated);
    notify("Exercice supprimé");
  };

  const saveCustomWorkout = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) {
      notify("Ajoute un nom et des exercices !");
      return;
    }
    const id = editingWorkout || `custom-${Date.now()}`;
    const updated = { ...customWorkouts, [id]: { ...newWorkout } };
    setCustomWorkouts(updated);
    setNewWorkout({ name: "", emoji: "⚪", exercises: [] });
    setShowAddWorkout(false);
    setEditingWorkout(null);
    notify(editingWorkout ? "Séance modifiée !" : "Séance créée !");
  };

  const deleteCustomWorkout = (id) => {
    if (!confirm("Supprimer cette séance ?")) return;
    const updated = { ...customWorkouts };
    delete updated[id];
    setCustomWorkouts(updated);
    notify("Séance supprimée");
  };

  const addExerciseToWorkout = () => {
    if (!newExercise.name || !newExercise.muscle) return;
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { ...newExercise }]
    });
    setNewExercise({ name: "", muscle: "", sets: 3, reps: "10-12" });
  };

  const removeExerciseFromWorkout = (index) => {
    const updated = [...newWorkout.exercises];
    updated.splice(index, 1);
    setNewWorkout({ ...newWorkout, exercises: updated });
  };

  const handleSwipe = (workoutId, exerciseIndex, direction) => {
    if (direction === 'left') {
      if (confirm("Supprimer cet exercice ?")) {
        removeCustomExercise(workoutId, exerciseIndex);
      }
    }
    setSwipedExercise(null);
  };

  const removeBaseExercise = (workoutId, exerciseIndex) => {
    // Ajouter l'exercice supprimé aux customExercises avec un flag "deleted"
    const deletedExercises = customExercises[`deleted-${workoutId}`] || [];
    const exerciseName = PROGRAM[workoutId].exercises[exerciseIndex].name;
    
    if (!deletedExercises.includes(exerciseName)) {
      const updated = { ...customExercises, [`deleted-${workoutId}`]: [...deletedExercises, exerciseName] };
      setCustomExercises(updated);
      notify("Exercice supprimé");
    }
  };

  const saveExerciseMedia = (exerciseName, mediaUrl) => {
    const updated = { ...exerciseMedia, [exerciseName]: mediaUrl };
    setExerciseMedia(updated);
    setAddingMediaTo(null);
    notify("Média ajouté !");
  };

  const updateWeeklySchedule = (dayOfWeek, workoutId) => {
    // Convertir workoutId en string pour éviter les problèmes de comparaison
    const workoutIdStr = String(workoutId);
    
    // Créer un nouvel objet (pas juste une copie de référence)
    const updated = {};
    
    // Copier toutes les assignations SAUF celle de cette séance
    Object.keys(weeklySchedule).forEach(day => {
      if (String(weeklySchedule[day]) !== workoutIdStr) {
        updated[day] = weeklySchedule[day];
      }
    });
    
    // Ajouter la nouvelle assignation seulement si ce n'est pas "none"
    if (dayOfWeek !== "none" && dayOfWeek !== null && !isNaN(dayOfWeek)) {
      updated[dayOfWeek] = workoutId;
    }
    
    setWeeklySchedule(updated);
    notify("Planning mis à jour !");
  };

  const resetAll = async () => { if(confirm("Supprimer toutes les données ?")){setData({sessions:[],weightLog:[],measurements:[],meals:[]});setCustomExercises({});setCustomWorkouts({});setWeeklySchedule(WEEKLY_PLAN);try{await window.storage.delete(SK);}catch(e){}notify("Données effacées");} };

  const weekSess = sessions.filter((s) => { const d=new Date(s.date),sw=new Date(today); sw.setDate(today.getDate()-((today.getDay()||7)-1)); sw.setHours(0,0,0,0); return d>=sw; });
  const feel = ["","😰","😕","😐","💪","🔥"];

  const Spark = ({values,color="#1a1a1a",height=40}) => {
    const n=values.map(Number).filter(v=>!isNaN(v)); if(n.length<2)return null;
    const mn=Math.min(...n),mx=Math.max(...n),r=mx-mn||1,w=200;
    const pts=n.map((v,i)=>`${(i/(n.length-1))*w},${height-4-((v-mn)/r)*(height-8)}`);
    const lp=pts[pts.length-1].split(",");
    return <svg viewBox={`0 0 ${w} ${height}`} style={{width:"100%",height,display:"block"}} preserveAspectRatio="none"><polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx={lp[0]} cy={lp[1]} r="3" fill={color}/></svg>;
  };

  const Ring = ({value, max, size=80, stroke=8, color="#3B8BD4", label}) => {
    const pct = Math.min(value/max, 1);
    const r = (size-stroke)/2, circ = 2*Math.PI*r;
    return <div style={{textAlign:"center"}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0eeea" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={pct>=1?"#3D9E4F":color} strokeWidth={stroke} strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.4s ease"}}/>
      </svg>
      <div style={{marginTop:-size/2-8,paddingTop:size>70?22:18,fontSize:size>70?18:13,fontWeight:700}}>{Math.round(value)}</div>
      <div style={{fontSize:10,color:"#999",fontWeight:600,marginTop:size>70?4:2}}>{label}</div>
    </div>;
  };

  if(!loaded) return <div style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}><p style={{color:"#888"}}>Chargement...</p></div>;

  const filteredFoods = foodSearch ? COMMON_FOODS.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())) : COMMON_FOODS;

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",maxWidth:680,margin:"0 auto",position:"relative",paddingBottom:80,color:"#1a1a1a",background:"#fff",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>

      {notif && <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",color:"#fff",padding:"12px 24px",borderRadius:50,fontSize:14,fontWeight:600,zIndex:100,animation:"slideDown .3s ease",boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>{notif}</div>}

      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .cd{background:#fff;border:1px solid #e8e5e0;border-radius:16px;padding:20px;margin-bottom:16px;animation:fadeIn .4s ease}
        .cd:hover{border-color:#d0ccc5}
        .bt{border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;border-radius:12px;transition:all .15s}
        .bt:active{transform:scale(.97)}
        .bp{background:#1a1a1a;color:#fff;padding:14px 28px;font-size:15px}.bp:hover{background:#333}
        .bo{background:transparent;border:1.5px solid #e8e5e0;color:#1a1a1a;padding:10px 20px;font-size:14px}.bo:hover{background:#f8f7f5}
        .nv{background:transparent;border:none;cursor:pointer;padding:8px 14px;font-size:13px;font-weight:600;color:#999;border-radius:8px;font-family:'DM Sans',sans-serif;transition:all .15s}
        .nv.a{background:#1a1a1a;color:#fff}.nv:hover:not(.a){color:#1a1a1a;background:#f5f4f2}
        .st{background:transparent;border:none;cursor:pointer;padding:6px 14px;font-size:13px;font-weight:600;color:#999;border-radius:20px;font-family:'DM Sans',sans-serif;transition:all .15s}
        .st.a{background:#f0eeea;color:#1a1a1a}.st:hover:not(.a){color:#666}
        .tg{display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
        input[type="text"],input[type="number"],textarea{font-family:'DM Sans',sans-serif;border:1.5px solid #e8e5e0;border-radius:10px;padding:10px 14px;font-size:14px;outline:none;transition:border .15s;width:100%;box-sizing:border-box}
        input:focus,textarea:focus{border-color:#1a1a1a}
        .food-item{padding:10px 12px;background:#f8f7f5;border-radius:10px;cursor:pointer;transition:all .15s;display:flex;justify-content:space-between;align-items:center}
        .food-item:hover{background:#f0eeea}
      `}</style>

      {/* Header */}
      <div style={{padding:"24px 0 8px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          {editingTitle ? 
            <input 
              type="text" 
              value={appTitle} 
              onChange={e=>setAppTitle(e.target.value)}
              onBlur={()=>setEditingTitle(false)}
              onKeyPress={e=>{if(e.key==='Enter')setEditingTitle(false)}}
              autoFocus
              style={{fontFamily:"'DM Serif Display',serif",fontSize:28,margin:0,letterSpacing:-.5,border:"none",outline:"2px solid #1a1a1a",borderRadius:8,padding:"4px 8px",background:"#fff"}}
            />
          :
            <h1 
              onClick={()=>setEditingTitle(true)} 
              style={{fontFamily:"'DM Serif Display',serif",fontSize:28,margin:0,letterSpacing:-.5,cursor:"pointer"}}
            >
              {appTitle}
            </h1>
          }
        <p style={{color:"#999",fontSize:13,margin:"4px 0 0",fontWeight:500}}>{DAYS[dow]} {today.getDate()} {MONTHS[today.getMonth()]}</p></div>
        <span style={{fontSize:13,fontWeight:700,background:"#f0eeea",padding:"6px 14px",borderRadius:20}}>🔥 {stats.total}</span>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:4,padding:"12px 0 20px",borderBottom:"1px solid #f0eeea",marginBottom:20,flexWrap:"wrap"}}>
        {[["home","Accueil"],["program","Programme"],["tracker","Tracker"],["calendar","Calendrier"],["achievements","Trophées"]].map(([v,l])=>(
          <button key={v} className={`nv ${view===v?"a":""}`} onClick={()=>setView(v)}>{l}</button>
        ))}
      </div>

      {/* ===== HOME ===== */}
      {view==="home" && <div>
        <div className="cd" style={{background:todaySess?"#f0faf2":todayPlan?"#fffaf0":"#f8f7f5",border:todaySess?"1px solid #c8e6cc":todayPlan?"1px solid #f0ddb8":"1px solid #e8e5e0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span className="tg" style={{background:todaySess?"#d4edda":todayPlan?"#ffecd2":"#eee",color:todaySess?"#276738":todayPlan?"#8a6320":"#888"}}>{todaySess?"✅ Fait":todayPlan?"Aujourd'hui":"Repos"}</span>
            {todayPlan&&<span style={{fontSize:20}}>{PROGRAM[todayPlan]?.emoji || customWorkouts[todayPlan]?.emoji}</span>}
          </div>
          {todayPlan?<><h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:700}}>{PROGRAM[todayPlan]?.name || customWorkouts[todayPlan]?.name}</h3>
          <p style={{color:"#888",fontSize:13,margin:"0 0 16px"}}>{(PROGRAM[todayPlan]?.exercises.length || customWorkouts[todayPlan]?.exercises.length || 0) + (customExercises[todayPlan]?.length || 0)} exercices · ~45 min</p>
          {!todaySess&&<button className="bt bp" onClick={()=>startLog(todayPlan)} style={{width:"100%"}}>Enregistrer ma séance →</button>}
          {todaySess&&<div style={{display:"flex",gap:12,fontSize:13,color:"#555"}}><span>{feel[todaySess.feeling]} {todaySess.feeling}/5</span><span>· {todaySess.exercises.length} exos</span></div>}
          </>:<><h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:700}}>Repos 🧘</h3><p style={{color:"#888",fontSize:13,margin:0}}>Récupère bien !</p></>}
        </div>

        {/* Calories today mini */}
        <div className="cd" style={{padding:16,cursor:"pointer"}} onClick={()=>{setView("tracker");setTTab("food")}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:700}}>🍽️ Nutrition aujourd'hui</span>
            <span style={{fontSize:13,color:"#888"}}>{Math.round(todayCal)} / {CALORIE_TARGET} kcal</span>
          </div>
          <div style={{background:"#f0eeea",borderRadius:20,height:8,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:20,background:todayCal>CALORIE_TARGET?"#E8593C":"#3D9E4F",width:`${Math.min(todayCal/CALORIE_TARGET*100,100)}%`,transition:"width .4s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"#999",fontWeight:600}}>
            <span>P: {Math.round(todayP)}g</span><span>G: {Math.round(todayF)}g</span><span>C: {Math.round(todayC)}g</span>
          </div>
        </div>

        {/* Week */}
        <div className="cd">
          <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700}}>Cette semaine</h3>
          <div style={{display:"flex",gap:6}}>
            {[1,2,3,4,5,6,0].map(d=>{const dd=new Date(today);dd.setDate(today.getDate()-((today.getDay()||7)-(d||7)));const ds=dd.toISOString().split("T")[0],dn=sessions.some(s=>s.date===ds),pl=weeklySchedule[d],ip=dd<new Date(today.getFullYear(),today.getMonth(),today.getDate()),it=ds===todayStr;
              const emoji = pl ? (PROGRAM[pl]?.emoji || customWorkouts[pl]?.emoji) : null;
              return <div key={d} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:12,background:dn?"#1a1a1a":it?"#f0eeea":"transparent",border:it&&!dn?"1.5px solid #ccc":"1.5px solid transparent"}}>
                <div style={{fontSize:11,fontWeight:600,color:dn?"#999":"#bbb",marginBottom:4}}>{DAYS[d]}</div>
                <div style={{fontSize:16}}>{dn?"✅":emoji?(ip?"❌":emoji):"·"}</div></div>;
            })}
          </div>
          <div style={{textAlign:"center",marginTop:12,fontSize:13,color:"#888",fontWeight:500}}>{weekSess.length}/4 séances</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[[stats.total,"Séances"],[stats.streak,"Sem. streak"],[`${unlocked.length}/${ACHIEVEMENTS_DEF.length}`,"Trophées"]].map(([v,l],i)=>(
            <div key={i} className="cd" style={{textAlign:"center",padding:16}}><div style={{fontSize:26,fontWeight:700}}>{v}</div><div style={{fontSize:11,color:"#999",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{l}</div></div>
          ))}
        </div>

        {weightLog.length>0&&<div className="cd" style={{padding:16,cursor:"pointer"}} onClick={()=>{setView("tracker");setTTab("weight")}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700}}>⚖️ Poids</span><span style={{fontSize:20,fontWeight:700}}>{weightLog[weightLog.length-1].weight} kg</span></div>
          <Spark values={weightLog.map(w=>w.weight)} color="#3B8BD4" height={36}/>
        </div>}
      </div>}

      {/* ===== PROGRAM ===== */}
      {view==="program" && <div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,margin:"0 0 20px"}}>Programme</h2>
        {Object.entries(PROGRAM).map(([id,w])=><div key={id} className="cd">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{w.emoji}</span><span style={{fontSize:16,fontWeight:700}}>{w.name}</span></div>
            <select value={Object.entries(weeklySchedule).find(([d,wId])=>String(wId)===String(id))?.[0]||"none"} onChange={e=>{const val=e.target.value; updateWeeklySchedule(val==="none"?"none":parseInt(val),id)}} style={{fontFamily:"'DM Sans',sans-serif",border:"1.5px solid #e8e5e0",borderRadius:8,padding:"4px 8px",fontSize:12,fontWeight:600,background:"#fff",cursor:"pointer"}}>
              <option value="none">Aucun jour</option>
              <option value="1">Lundi</option>
              <option value="2">Mardi</option>
              <option value="3">Mercredi</option>
              <option value="4">Jeudi</option>
              <option value="5">Vendredi</option>
              <option value="6">Samedi</option>
              <option value="0">Dimanche</option>
            </select>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {w.type==="cardio" ? (
              customExercises[id]?.length > 0 ? customExercises[id].map((ex,i)=>{
                let touchStartX = 0;
                let touchEndX = 0;
                const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
                const handleTouchMove = (e) => { touchEndX = e.touches[0].clientX; };
                const handleTouchEnd = () => {
                  if (touchStartX - touchEndX > 50) { // swipe left
                    handleSwipe(id, i, 'left');
                  }
                };
                return <div key={`cardio-${i}`} 
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#fffdf5",borderRadius:10,border:"1px solid #f0ddb8"}}>
                  <div><div style={{fontSize:14,fontWeight:500}}>{ex.name}</div><div style={{fontSize:12,color:"#999"}}>{ex.muscle} kms · {ex.sets} min · {ex.reps} BPM</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <button onClick={()=>removeCustomExercise(id,i)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#ccc",padding:2}}>✕</button>
                  </div>
                </div>
              }) : <div style={{textAlign:"center",padding:12,color:"#999",fontSize:13}}>Ajoute des exercices cardio ci-dessous</div>
            ) : (
              <>
                {w.exercises.filter((ex,idx)=>!(customExercises[`deleted-${id}`]||[]).includes(ex.name)).map((ex,i)=>{
                  const originalIndex = w.exercises.indexOf(ex);
                  let touchStartX = 0;
                  let touchEndX = 0;
                  const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
                  const handleTouchMove = (e) => { touchEndX = e.touches[0].clientX; };
                  const handleTouchEnd = () => {
                    if (touchStartX - touchEndX > 50) { // swipe left
                      if (confirm("Supprimer cet exercice ?")) {
                        removeBaseExercise(id, originalIndex);
                      }
                    }
                  };
                  const hasMedia = exerciseMedia[ex.name];
                  return <div key={i}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={()=>setSelectedExercise(ex)}
                    style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#f8f7f5",borderRadius:10,cursor:"pointer",position:"relative"}}>
                    {hasMedia && <div style={{position:"absolute",top:8,right:8,fontSize:12}}>🎬</div>}
                    <div><div style={{fontSize:14,fontWeight:500}}>{ex.name}</div><div style={{fontSize:12,color:"#999"}}>{ex.muscle}</div></div>
                    <div style={{fontSize:13,fontWeight:600,color:"#666",whiteSpace:"nowrap"}}>{ex.sets}×{ex.reps}</div>
                  </div>
                })}
                {customExercises[id]?.map((ex,i)=>{
                  let touchStartX = 0;
                  let touchEndX = 0;
                  const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
                  const handleTouchMove = (e) => { touchEndX = e.touches[0].clientX; };
                  const handleTouchEnd = () => {
                    if (touchStartX - touchEndX > 50) { // swipe left
                      handleSwipe(id, i, 'left');
                    }
                  };
                  const hasMedia = exerciseMedia[ex.name];
                  return <div key={`custom-${i}`}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={()=>setSelectedExercise(ex)}
                    style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#fffdf5",borderRadius:10,border:"1px solid #f0ddb8",cursor:"pointer",position:"relative"}}>
                    {hasMedia && <div style={{position:"absolute",top:8,right:8,fontSize:12}}>🎬</div>}
                    <div><div style={{fontSize:14,fontWeight:500}}>{ex.name}</div><div style={{fontSize:12,color:"#999"}}>{ex.muscle}</div></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#666",whiteSpace:"nowrap"}}>{ex.sets}×{ex.reps}</div>
                      <button onClick={(e)=>{e.stopPropagation();removeCustomExercise(id,i)}} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#ccc",padding:2}}>✕</button>
                    </div>
                  </div>
                })}
              </>
            )}
          </div>
          
          {showAddExercise===id ? <div style={{marginTop:12,padding:12,background:"#f8f7f5",borderRadius:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,color:"#999",fontWeight:600}}>Nom de l'exercice</label><input type="text" value={newExercise.name} onChange={e=>setNewExercise({...newExercise,name:e.target.value})} placeholder={w.type==="cardio"?"Ex: Course à pied":"Ex: Curl incliné"}/></div>
              {w.type==="cardio" ? <>
                <div><label style={{fontSize:11,color:"#999",fontWeight:600}}>Distance (kms)</label><input type="text" value={newExercise.muscle} onChange={e=>setNewExercise({...newExercise,muscle:e.target.value})} placeholder="5"/></div>
                <div><label style={{fontSize:11,color:"#999",fontWeight:600}}>Temps (min)</label><input type="text" value={newExercise.sets} onChange={e=>setNewExercise({...newExercise,sets:e.target.value})} placeholder="30"/></div>
                <div><label style={{fontSize:11,color:"#999",fontWeight:600}}>Heartrate (BPM)</label><input type="text" value={newExercise.reps} onChange={e=>setNewExercise({...newExercise,reps:e.target.value})} placeholder="150"/></div>
              </> : <>
                <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,color:"#999",fontWeight:600}}>Partie travaillée</label><input type="text" value={newExercise.muscle} onChange={e=>setNewExercise({...newExercise,muscle:e.target.value})} placeholder="Ex: Biceps"/></div>
                <div><label style={{fontSize:11,color:"#999",fontWeight:600}}>Séries</label><input type="number" value={newExercise.sets} onChange={e=>setNewExercise({...newExercise,sets:parseInt(e.target.value)||3})} min="1"/></div>
                <div><label style={{fontSize:11,color:"#999",fontWeight:600}}>Reps</label><input type="text" value={newExercise.reps} onChange={e=>setNewExercise({...newExercise,reps:e.target.value})} placeholder="10-12"/></div>
              </>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="bt bp" onClick={()=>addCustomExercise(id)} style={{flex:1,padding:"8px 16px",fontSize:13}}>✅ Ajouter</button>
              <button className="bt bo" onClick={()=>{setShowAddExercise(null);setNewExercise({name:"",muscle:"",sets:3,reps:"10-12"})}} style={{flex:1,padding:"8px 16px",fontSize:13}}>Annuler</button>
            </div>
          </div> : <button className="bt bo" onClick={()=>setShowAddExercise(id)} style={{width:"100%",marginTop:12,fontSize:13}}>+ Ajouter un exercice</button>}
        </div>)}

        {/* Séances personnalisées */}
        <div style={{marginTop:24,marginBottom:16}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,margin:"0 0 12px"}}>Mes séances personnalisées</h3>
          {Object.entries(customWorkouts).map(([id,w])=><div key={id} className="cd">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{w.emoji}</span><span style={{fontSize:16,fontWeight:700}}>{w.name}</span></div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <select value={Object.entries(weeklySchedule).find(([d,wId])=>String(wId)===String(id))?.[0]||"none"} onChange={e=>{const val=e.target.value; updateWeeklySchedule(val==="none"?"none":parseInt(val),id)}} style={{fontFamily:"'DM Sans',sans-serif",border:"1.5px solid #e8e5e0",borderRadius:8,padding:"4px 8px",fontSize:12,fontWeight:600,background:"#fff",cursor:"pointer"}}>
                  <option value="none">Aucun jour</option>
                  <option value="1">Lundi</option>
                  <option value="2">Mardi</option>
                  <option value="3">Mercredi</option>
                  <option value="4">Jeudi</option>
                  <option value="5">Vendredi</option>
                  <option value="6">Samedi</option>
                  <option value="0">Dimanche</option>
                </select>
                <button className="bt bo" onClick={()=>{setEditingWorkout(id);setNewWorkout({...w});setShowAddWorkout(true)}} style={{padding:"4px 12px",fontSize:12}}>✏️</button>
                <button className="bt bo" onClick={()=>deleteCustomWorkout(id)} style={{padding:"4px 12px",fontSize:12,color:"#c33",borderColor:"#ecc"}}>✕</button>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {w.exercises.map((ex,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#f8f7f5",borderRadius:10}}>
                <div><div style={{fontSize:14,fontWeight:500}}>{ex.name}</div><div style={{fontSize:12,color:"#999"}}>{ex.muscle}</div></div>
                <div style={{fontSize:13,fontWeight:600,color:"#666",whiteSpace:"nowrap"}}>{ex.sets}×{ex.reps}</div>
              </div>)}
            </div>
          </div>)}

          {showAddWorkout ? <div className="cd" style={{background:"#f8f7f5"}}>
            <h4 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>{editingWorkout?"Modifier":"Créer"} une séance</h4>
            
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:"#999",fontWeight:600,display:"block",marginBottom:4}}>Nom de la séance</label>
              <input type="text" value={newWorkout.name} onChange={e=>setNewWorkout({...newWorkout,name:e.target.value})} placeholder="Ex: Upper Body"/>
            </div>

            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:"#999",fontWeight:600,display:"block",marginBottom:6}}>Couleur / Emoji</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["🔴","🔵","🟢","🟡","🟣","🟠","⚪","⚫","🟤","🔷","🔶","💚","💙","💜","🧡","❤️"].map(e=>
                  <button key={e} onClick={()=>setNewWorkout({...newWorkout,emoji:e})} style={{fontSize:24,background:newWorkout.emoji===e?"#e0e0e0":"transparent",border:newWorkout.emoji===e?"2px solid #1a1a1a":"2px solid transparent",borderRadius:8,padding:"4px 8px",cursor:"pointer"}}>
                    {e}
                  </button>
                )}
              </div>
            </div>

            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:"#999",fontWeight:600,display:"block",marginBottom:6}}>Exercices ({newWorkout.exercises.length})</label>
              {newWorkout.exercises.length>0&&<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                {newWorkout.exercises.map((ex,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"#fff",borderRadius:8,fontSize:13}}>
                  <div><strong>{ex.name}</strong> · {ex.muscle} · {ex.sets}×{ex.reps}</div>
                  <button onClick={()=>removeExerciseFromWorkout(i)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#ccc"}}>✕</button>
                </div>)}
              </div>}
              
              <div style={{padding:10,background:"#fff",borderRadius:8}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                  <div style={{gridColumn:"1/-1"}}><input type="text" value={newExercise.name} onChange={e=>setNewExercise({...newExercise,name:e.target.value})} placeholder="Nom exercice" style={{padding:"6px 10px",fontSize:12}}/></div>
                  <div style={{gridColumn:"1/-1"}}><input type="text" value={newExercise.muscle} onChange={e=>setNewExercise({...newExercise,muscle:e.target.value})} placeholder="Muscle" style={{padding:"6px 10px",fontSize:12}}/></div>
                  <input type="number" value={newExercise.sets} onChange={e=>setNewExercise({...newExercise,sets:parseInt(e.target.value)||3})} placeholder="Séries" min="1" style={{padding:"6px 10px",fontSize:12}}/>
                  <input type="text" value={newExercise.reps} onChange={e=>setNewExercise({...newExercise,reps:e.target.value})} placeholder="Reps" style={{padding:"6px 10px",fontSize:12}}/>
                </div>
                <button className="bt bo" onClick={addExerciseToWorkout} style={{width:"100%",fontSize:12,padding:"6px 12px"}}>+ Ajouter l'exercice</button>
              </div>
            </div>

            <div style={{display:"flex",gap:8}}>
              <button className="bt bp" onClick={saveCustomWorkout} style={{flex:1}}>💾 Sauvegarder</button>
              <button className="bt bo" onClick={()=>{setShowAddWorkout(false);setEditingWorkout(null);setNewWorkout({name:"",emoji:"⚪",exercises:[]});setNewExercise({name:"",muscle:"",sets:3,reps:"10-12"})}} style={{flex:1}}>Annuler</button>
            </div>
          </div> : <button className="bt bp" onClick={()=>setShowAddWorkout(true)} style={{width:"100%",fontSize:14}}>➕ Créer une séance personnalisée</button>}
        </div>
      </div>}

      {/* ===== EXERCISE MODAL ===== */}
      {selectedExercise && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSelectedExercise(null)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:20,maxWidth:500,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{fontSize:18,fontWeight:700,margin:0}}>{selectedExercise.name}</h3>
            <button className="bt bo" onClick={()=>setSelectedExercise(null)} style={{padding:"4px 12px",fontSize:12}}>✕</button>
          </div>
          
          {exerciseMedia[selectedExercise.name] ? (
            <div style={{marginBottom:16}}>
              {exerciseMedia[selectedExercise.name].match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={exerciseMedia[selectedExercise.name]} controls style={{width:"100%",borderRadius:10}}/>
              ) : (
                <img src={exerciseMedia[selectedExercise.name]} alt={selectedExercise.name} style={{width:"100%",borderRadius:10}}/>
              )}
              <button className="bt bo" onClick={()=>{const u={...exerciseMedia};delete u[selectedExercise.name];setExerciseMedia(u);notify("Média supprimé")}} style={{width:"100%",marginTop:8,fontSize:12,color:"#c33",borderColor:"#ecc"}}>Supprimer le média</button>
            </div>
          ) : (
            <div style={{marginBottom:16,padding:20,background:"#f8f7f5",borderRadius:10,textAlign:"center"}}>
              <p style={{fontSize:14,color:"#999",margin:"0 0 12px"}}>Aucun média ajouté</p>
              {addingMediaTo === selectedExercise.name ? (
                <div>
                  <input 
                    type="text" 
                    placeholder="URL de l'image, GIF ou vidéo"
                    value={mediaPreviewUrl}
                    onChange={e=>setMediaPreviewUrl(e.target.value)}
                    onKeyPress={e=>{if(e.key==='Enter' && mediaPreviewUrl) {saveExerciseMedia(selectedExercise.name, mediaPreviewUrl);setMediaPreviewUrl("")}}}
                    style={{width:"100%",marginBottom:12,padding:"10px 12px",fontSize:13}}
                  />
                  
                  {mediaPreviewUrl && (
                    <div style={{marginBottom:12,padding:12,background:"#fff",borderRadius:10,border:"1px solid #e8e5e0"}}>
                      <p style={{fontSize:12,fontWeight:600,marginBottom:8,color:"#666"}}>Aperçu :</p>
                      {mediaPreviewUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={mediaPreviewUrl} controls style={{width:"100%",borderRadius:8,maxHeight:200}}/>
                      ) : (
                        <>
                          <img 
                            src={mediaPreviewUrl} 
                            alt="Preview" 
                            style={{width:"100%",borderRadius:8,maxHeight:200,objectFit:"cover"}} 
                            onError={e=>{e.target.style.display='none';e.target.nextElementSibling.style.display='block'}}
                          />
                          <div style={{display:'none',padding:12,color:"#ff8800",fontSize:12,background:"#fff8e6",borderRadius:8}}>
                            ⚠️ Aperçu indisponible (le site bloque l'affichage externe)<br/>
                            <span style={{fontSize:11,color:"#999"}}>Tu peux quand même sauvegarder, l'image s'affichera peut-être dans l'app</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div style={{display:"flex",gap:8}}>
                    <button className="bt bp" onClick={()=>{if(mediaPreviewUrl){saveExerciseMedia(selectedExercise.name,mediaPreviewUrl);setMediaPreviewUrl("")}}} style={{flex:1,fontSize:12,padding:"8px"}}>Sauvegarder</button>
                    <button className="bt bo" onClick={()=>{setAddingMediaTo(null);setMediaPreviewUrl("")}} style={{flex:1,fontSize:12,padding:"8px"}}>Annuler</button>
                  </div>
                </div>
              ) : (
                <button className="bt bp" onClick={()=>setAddingMediaTo(selectedExercise.name)} style={{fontSize:13}}>+ Ajouter image/GIF/vidéo</button>
              )}
            </div>
          )}
          
          <div style={{padding:12,background:"#f8f7f5",borderRadius:10}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Partie travaillée</div>
            <div style={{fontSize:14,color:"#666"}}>{selectedExercise.muscle}</div>
          </div>
          
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            <div style={{padding:12,background:"#f8f7f5",borderRadius:10}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Séries</div>
              <div style={{fontSize:18,fontWeight:700}}>{selectedExercise.sets}</div>
            </div>
            <div style={{padding:12,background:"#f8f7f5",borderRadius:10}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Répétitions</div>
              <div style={{fontSize:18,fontWeight:700}}>{selectedExercise.reps}</div>
            </div>
          </div>
        </div>
      </div>}

      {/* ===== TRACKER ===== */}
      {view==="tracker" && <div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,margin:"0 0 6px"}}>Tracker</h2>
        <p style={{color:"#888",fontSize:13,margin:"0 0 16px"}}>Performances, nutrition, poids et mensurations</p>
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {[["perf","📊 Perfs"],["food","🍽️ Nutrition"],["weight","⚖️ Poids"],["meas","📐 Mensurations"]].map(([k,l])=>(
            <button key={k} className={`st ${tTab===k?"a":""}`} onClick={()=>{setTTab(k);setTExercise(null)}}>{l}</button>
          ))}
        </div>

        {/* PERF TAB */}
        {tTab==="perf" && <div>
          {sessions.length===0 ? <div className="cd" style={{textAlign:"center",padding:32,color:"#999"}}><p style={{fontSize:32,margin:"0 0 8px"}}>📊</p><p style={{fontSize:14,margin:0}}>Enregistre ta première séance !</p></div>
          : <div>
            {/* Menu déroulant par séance */}
            {Object.entries(PROGRAM).concat(Object.entries(customWorkouts)).map(([wId,workout])=>{
              const exos=workout.exercises?.filter(ex=>sessions.some(s=>s.exercises?.some(e=>e.name===ex.name&&e.weight))) || [];
              const customExos = customExercises[wId]?.filter(ex=>sessions.some(s=>s.exercises?.some(e=>e.name===ex.name&&e.weight))) || [];
              const allExos = [...exos, ...customExos];
              if(!allExos.length)return null;
              
              const isExpanded = expandedWorkout === wId;
              
              return <div key={wId} className="cd" style={{marginBottom:12}}>
                <div onClick={()=>setExpandedWorkout(isExpanded?null:wId)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{workout.emoji}</span>
                    <span style={{fontSize:15,fontWeight:700}}>{workout.name}</span>
                  </div>
                  <span style={{fontSize:18,transition:"transform .2s",transform:isExpanded?"rotate(180deg)":"rotate(0)"}}>{isExpanded?"▲":"▼"}</span>
                </div>
                
                {isExpanded && <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f0eeea"}}>
                  {allExos.map(ex=>{
                    const h=getExHist(ex.name);
                    const last=h.length?h[h.length-1].weight:null;
                    const first=h.length>1?h[0].weight:null;
                    const diff=last&&first?Math.round((parseFloat(last)-parseFloat(first))*10)/10:0;
                    
                    return <div key={ex.name} style={{marginBottom:12,padding:12,background:"#f8f7f5",borderRadius:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div><div style={{fontSize:14,fontWeight:600}}>{ex.name}</div><div style={{fontSize:11,color:"#999"}}>{h.length} entrée{h.length>1?"s":""}</div></div>
                        <div style={{textAlign:"right"}}>{last&&<div style={{fontSize:16,fontWeight:700}}>{last} kg</div>}{diff!==0&&<div style={{fontSize:12,fontWeight:600,color:diff>0?"#3D9E4F":"#E8593C"}}>{diff>0?"+":""}{diff} kg</div>}</div>
                      </div>
                      {h.length>=2&&<Spark values={h.map(x=>x.weight)} color={diff>=0?"#3D9E4F":"#E8593C"} height={30}/>}
                      <button className="bt bo" onClick={()=>setTExercise(ex.name)} style={{width:"100%",marginTop:8,fontSize:12,padding:"6px 12px"}}>Voir détails</button>
                    </div>;
                  })}
                </div>}
              </div>;
            })}
            
            {/* Vue détail exercice */}
            {tExercise && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setTExercise(null)}>
              <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:20,maxWidth:600,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 style={{fontSize:18,fontWeight:700,margin:0}}>{tExercise}</h3>
                  <button className="bt bo" onClick={()=>setTExercise(null)} style={{padding:"4px 12px",fontSize:12}}>✕</button>
                </div>
                {(()=>{const h=getExHist(tExercise);if(!h.length)return <p style={{color:"#999"}}>Aucune donnée.</p>;const mx=Math.max(...h.map(x=>parseFloat(x.weight)||0));
                  return <><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                    {[[h[h.length-1].weight,"DERNIER"],[Math.round(mx*10)/10,"MAX"],[h.length,"SÉANCES"]].map(([v,l],i)=><div key={i} style={{textAlign:"center",padding:14,background:"#f8f7f5",borderRadius:10}}><div style={{fontSize:22,fontWeight:700}}>{v}</div><div style={{fontSize:11,color:"#999",fontWeight:600}}>{l}</div></div>)}
                  </div>
                  {h.length>=2&&<div style={{padding:16,background:"#f8f7f5",borderRadius:10,marginBottom:16}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Progression</div><Spark values={h.map(x=>x.weight)} color="#3B8BD4" height={60}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb",marginTop:4}}><span>{h[0].date.slice(5)}</span><span>{h[h.length-1].date.slice(5)}</span></div></div>}
                  <div style={{background:"#f8f7f5",borderRadius:10,padding:16}}><div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Historique</div>
                    {[...h].reverse().map((x,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<h.length-1?"1px solid #e0e0e0":"none",fontSize:13}}><span style={{color:"#888"}}>{x.date}</span><span style={{fontWeight:600}}>{x.sets}×{x.reps} @ {x.weight} kg</span></div>)}
                  </div></>;
                })()}
              </div>
            </div>}
          </div>}
        </div>}

        {/* FOOD TAB */}
        {tTab==="food" && <div>
          {/* Daily summary */}
          <div className="cd" style={{padding:20}}>
            <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:16}}>
              <Ring value={todayCal} max={CALORIE_TARGET} size={90} stroke={8} color="#3B8BD4" label="kcal"/>
              <Ring value={todayP} max={MACRO_TARGETS.protein} size={70} stroke={6} color="#E8593C" label="Protéines"/>
              <Ring value={todayF} max={MACRO_TARGETS.fat} size={70} stroke={6} color="#D4A13B" label="Lipides"/>
              <Ring value={todayC} max={MACRO_TARGETS.carbs} size={70} stroke={6} color="#3D9E4F" label="Glucides"/>
            </div>
            <div style={{textAlign:"center",fontSize:12,color:"#999"}}>
              Objectif : {CALORIE_TARGET} kcal · {MACRO_TARGETS.protein}g P · {MACRO_TARGETS.fat}g G · {MACRO_TARGETS.carbs}g C
            </div>
          </div>

          {/* Add food */}
          <div className="cd">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:700}}>Ajouter un aliment</h3>
              <select value={mealType} onChange={e=>setMealType(e.target.value)} style={{fontFamily:"'DM Sans',sans-serif",border:"1.5px solid #e8e5e0",borderRadius:10,padding:"6px 12px",fontSize:13,fontWeight:600,background:"#fff",cursor:"pointer"}}>
                {MEAL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <input type="text" placeholder="Chercher un aliment..." value={foodSearch} onChange={e=>setFoodSearch(e.target.value)} style={{marginBottom:10}}/>

            <div style={{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
              {filteredFoods.map((f,i)=>(
                <div key={i} className="food-item" onClick={()=>addMeal(f)}>
                  <div><div style={{fontSize:13,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:"#999"}}>P:{f.protein}g · G:{f.fat}g · C:{f.carbs}g</div></div>
                  <div style={{fontSize:14,fontWeight:700,whiteSpace:"nowrap"}}>{f.cal} kcal</div>
                </div>
              ))}
            </div>

            <button className="bt bo" onClick={()=>setShowCustom(!showCustom)} style={{width:"100%",fontSize:13,padding:"8px 16px"}}>
              {showCustom?"Fermer":"+ Aliment personnalisé"}
            </button>

            {showCustom && <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,color:"#999",fontWeight:600}}>Nom</label><input type="text" value={customFood.name} onChange={e=>setCustomFood({...customFood,name:e.target.value})} placeholder="Ex: Smoothie maison"/></div>
              {[["Calories (kcal)","cal"],["Protéines (g)","protein"],["Lipides (g)","fat"],["Glucides (g)","carbs"]].map(([l,k])=>(
                <div key={k}><label style={{fontSize:11,color:"#999",fontWeight:600}}>{l}</label><input type="number" value={customFood[k]} onChange={e=>setCustomFood({...customFood,[k]:e.target.value})} placeholder="0"/></div>
              ))}
              <button className="bt bp" onClick={addCustomMeal} style={{gridColumn:"1/-1",padding:"10px 20px"}}>Ajouter</button>
            </div>}
          </div>

          {/* Today's meals */}
          {todayMeals.length > 0 && <div className="cd">
            <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>Repas du jour</h3>
            {MEAL_TYPES.map(type => {
              const items = todayMeals.filter(m => m.meal === type);
              if (!items.length) return null;
              const typeCal = items.reduce((s,m) => s + (m.cal||0), 0);
              return <div key={type} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{type}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"#888"}}>{Math.round(typeCal)} kcal</span>
                </div>
                {items.map((m,i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<items.length-1?"1px solid #f0eeea":"none"}}>
                    <div><div style={{fontSize:13,fontWeight:500}}>{m.name}</div><div style={{fontSize:11,color:"#999"}}>P:{Math.round(m.protein)}g · G:{Math.round(m.fat)}g · C:{Math.round(m.carbs)}g</div></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:600}}>{m.cal} kcal</span>
                      <button onClick={()=>removeMeal(m.ts)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#ccc",padding:2}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>;
            })}
          </div>}

          {/* Calorie history */}
          {(()=>{
            const dayMap = {};
            meals.forEach(m => { if(!dayMap[m.date]) dayMap[m.date] = 0; dayMap[m.date] += m.cal||0; });
            const days = Object.entries(dayMap).sort((a,b) => a[0].localeCompare(b[0]));
            if(days.length < 2) return null;
            return <div className="cd" style={{padding:16}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Historique calories</div>
              <Spark values={days.map(d=>d[1])} color="#3B8BD4" height={50}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb",marginTop:4}}><span>{days[0][0].slice(5)}</span><span>{days[days.length-1][0].slice(5)}</span></div>
              <div style={{borderTop:"1px solid #f0eeea",marginTop:12,paddingTop:12}}>
                {[...days].reverse().slice(0,7).map(([d,c],i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13,borderBottom:i<Math.min(days.length,7)-1?"1px solid #f0eeea":"none"}}>
                    <span style={{color:"#888"}}>{d}</span>
                    <span style={{fontWeight:600,color:c>CALORIE_TARGET*1.1?"#E8593C":c<CALORIE_TARGET*.8?"#D4A13B":"#3D9E4F"}}>{Math.round(c)} kcal</span>
                  </div>
                ))}
              </div>
            </div>;
          })()}
        </div>}

        {/* WEIGHT TAB */}
        {tTab==="weight" && <div>
          <div className="cd"><h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>Check hebdo</h3>
            <div style={{display:"flex",gap:8}}><input type="number" step="0.1" placeholder="Ex : 76.2" value={weightForm} onChange={e=>setWeightForm(e.target.value)} style={{flex:1}}/><button className="bt bp" onClick={saveWeight} style={{padding:"10px 20px",whiteSpace:"nowrap"}}>Enregistrer</button></div>
          </div>
          {weightLog.length>0?<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {(()=>{const d=Math.round((weightLog[weightLog.length-1].weight-weightLog[0].weight)*10)/10;
                return [[weightLog[weightLog.length-1].weight,"ACTUEL"],[weightLog[0].weight,"DÉPART"],[(d>0?"+":"")+d,"ÉVOLUTION",d>0?"#E8593C":d<0?"#3D9E4F":"#888"]].map(([v,l,c],i)=>
                  <div key={i} className="cd" style={{textAlign:"center",padding:14}}><div style={{fontSize:22,fontWeight:700,color:c||"inherit"}}>{v}</div><div style={{fontSize:11,color:"#999",fontWeight:600}}>{l} (KG)</div></div>
                );})()}
            </div>
            {weightLog.length>=2&&<div className="cd" style={{padding:16}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Courbe</div><Spark values={weightLog.map(w=>w.weight)} color="#3B8BD4" height={60}/></div>}
            <div className="cd"><div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Historique</div>
              {[...weightLog].reverse().map((w,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<weightLog.length-1?"1px solid #f0eeea":"none",fontSize:13}}><span style={{color:"#888"}}>{w.date}</span><span style={{fontWeight:600}}>{w.weight} kg</span></div>)}
            </div>
          </>:<div className="cd" style={{textAlign:"center",padding:32,color:"#999"}}><p style={{fontSize:32,margin:"0 0 8px"}}>⚖️</p><p style={{fontSize:14,margin:0}}>Enregistre ton premier poids !</p></div>}
        </div>}

        {/* MEAS TAB */}
        {tTab==="meas" && <div>
          <div className="cd"><h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:700}}>Nouvelles mensurations</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {MEAS_FIELDS.map(f=><div key={f.key}><label style={{fontSize:11,color:"#999",fontWeight:600,display:"block",marginBottom:4}}>{f.label} (cm)</label><input type="number" step="0.1" placeholder="—" value={measForm[f.key]||""} onChange={e=>setMeasForm({...measForm,[f.key]:e.target.value})}/></div>)}
            </div>
            <button className="bt bp" onClick={saveMeas} style={{width:"100%",marginTop:14}}>Enregistrer</button>
          </div>
          {measurements.length>0?<>
            <div className="cd">
              <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Dernières — {measurements[measurements.length-1].date}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {MEAS_FIELDS.map(f=>{const last=measurements[measurements.length-1][f.key];if(!last)return null;const first=measurements.length>1?measurements[0][f.key]:null;const diff=last&&first?Math.round((parseFloat(last)-parseFloat(first))*10)/10:0;const vals=measurements.map(m=>m[f.key]).filter(Boolean);
                  return <div key={f.key} style={{padding:"10px 12px",background:"#f8f7f5",borderRadius:10}}>
                    <div style={{fontSize:11,color:"#999",fontWeight:600}}>{f.label}</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:18,fontWeight:700}}>{last} cm</span>{diff!==0&&<span style={{fontSize:12,fontWeight:600,color:diff>0?"#3D9E4F":"#E8593C"}}>{diff>0?"+":""}{diff}</span>}</div>
                    {vals.length>=2&&<Spark values={vals} color="#D4A13B" height={24}/>}
                  </div>;
                })}
              </div>
            </div>
          </>:<div className="cd" style={{textAlign:"center",padding:32,color:"#999"}}><p style={{fontSize:32,margin:"0 0 8px"}}>📐</p><p style={{fontSize:14,margin:0}}>Enregistre tes premières mensurations !</p></div>}
        </div>}
      </div>}

      {/* ===== CALENDAR ===== */}
      {view==="calendar" && <div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,margin:"0 0 20px"}}>{MONTHS[today.getMonth()]} {today.getFullYear()}</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>{DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:"#bbb",padding:6}}>{d}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {calDays().map((d,i)=>{if(!d)return <div key={i}/>;
            const emoji = d.planned ? (PROGRAM[d.planned]?.emoji || customWorkouts[d.planned]?.emoji) : null;
            return <div key={i} onClick={()=>{if(d.session)setSelectedDay(d);else if(d.planned&&(d.isToday||d.isPast))startLog(d.planned,d.dateStr);}}
              style={{textAlign:"center",padding:"10px 4px",borderRadius:10,cursor:(d.session||(d.planned&&(d.isToday||d.isPast)))?"pointer":"default",background:d.session?"#1a1a1a":d.isToday?"#f0eeea":d.planned&&d.isPast?"#fef0f0":"transparent",color:d.session?"#fff":"#1a1a1a",border:d.isToday&&!d.session?"1.5px solid #ccc":"1.5px solid transparent",transition:"all .15s"}}>
              <div style={{fontSize:14,fontWeight:d.isToday?700:500}}>{d.day}</div>
              {d.session&&<div style={{fontSize:10,marginTop:2}}>{PROGRAM[d.session.workoutId]?.emoji || customWorkouts[d.session.workoutId]?.emoji}</div>}
              {!d.session&&emoji&&!d.isPast&&<div style={{fontSize:8,marginTop:2,opacity:.4}}>{emoji}</div>}
              {!d.session&&d.planned&&d.isPast&&<div style={{fontSize:10,marginTop:2}}>❌</div>}
            </div>;
          })}
        </div>
        {selectedDay?.session&&<div className="cd" style={{marginTop:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><h3 style={{margin:0,fontSize:15,fontWeight:700}}>{PROGRAM[selectedDay.session.workoutId]?.emoji} {selectedDay.dateStr}</h3><button className="bt bo" style={{padding:"4px 12px",fontSize:12}} onClick={()=>setSelectedDay(null)}>✕</button></div>
          <div style={{fontSize:13,color:"#888"}}>{feel[selectedDay.session.feeling]} {selectedDay.session.feeling}/5</div>
          {selectedDay.session.exercises.map((ex,i)=><div key={i} style={{padding:"6px 0",fontSize:13,borderBottom:i<selectedDay.session.exercises.length-1?"1px solid #f0eeea":"none"}}><span style={{fontWeight:500}}>{ex.name}</span> — {ex.sets}×{ex.reps} {ex.weight&&`@ ${ex.weight}kg`}</div>)}
        </div>}

        {/* Import/Export */}
        <div className="cd" style={{marginTop:16}}>
          <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>💾 Sauvegarder / Importer</h3>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button className="bt bo" onClick={exportData} style={{flex:1}}>📤 Exporter mes données</button>
            <button className="bt bo" onClick={()=>setShowImport(!showImport)} style={{flex:1}}>📥 Importer</button>
          </div>
          {showImport && <div>
            <textarea 
              value={importData} 
              onChange={e=>setImportData(e.target.value)} 
              placeholder='Colle ici le JSON généré par Claude...'
              rows={6}
              style={{resize:"vertical",marginBottom:8,fontFamily:"monospace",fontSize:12}}
            />
            <button className="bt bp" onClick={importSessions} style={{width:"100%"}}>✅ Importer les séances</button>
          </div>}
        </div>
      </div>}

      {/* ===== ACHIEVEMENTS ===== */}
      {view==="achievements" && <div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,margin:"0 0 6px"}}>Trophées</h2>
        <p style={{color:"#888",fontSize:13,margin:"0 0 20px"}}>{unlocked.length}/{ACHIEVEMENTS_DEF.length} débloqués</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {ACHIEVEMENTS_DEF.map(a=>{const u=a.cond(stats);return <div key={a.id} className="cd" style={{opacity:u?1:.4,padding:16,textAlign:"center",background:u?"#fffdf5":"#f8f7f5",border:u?"1.5px solid #e8deb5":"1px solid #e8e5e0",animation:u?"pulse 2s ease infinite":"none"}}>
            <div style={{fontSize:32,marginBottom:6}}>{a.icon}</div><div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{a.name}</div><div style={{fontSize:11,color:"#999"}}>{a.desc}</div>
            {u&&<div className="tg" style={{marginTop:8,background:"#d4edda",color:"#276738",fontSize:10}}>Débloqué !</div>}
          </div>;})}
        </div>
        <button className="bt bo" onClick={resetAll} style={{marginTop:20,width:"100%",color:"#c33",borderColor:"#ecc"}}>Réinitialiser toutes les données</button>
      </div>}

      {/* ===== LOG FORM ===== */}
      {view==="log"&&logForm&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,margin:0}}>Enregistrer</h2><p style={{color:"#888",fontSize:13,margin:"4px 0 0"}}>{(PROGRAM[logForm.workoutId]?.emoji || customWorkouts[logForm.workoutId]?.emoji)} {(PROGRAM[logForm.workoutId]?.name || customWorkouts[logForm.workoutId]?.name)}</p></div>
          <button className="bt bo" onClick={()=>{setLogForm(null);setView("home")}}>Annuler</button>
        </div>
        {logForm.exercises.map((ex,i)=>{
          const isCardio = PROGRAM[logForm.workoutId]?.type === "cardio";
          return <div key={i} className="cd" style={{padding:14,opacity:ex.done?1:.5}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:ex.done?10:0}}>
              <input type="checkbox" checked={ex.done} onChange={e=>{const u=[...logForm.exercises];u[i]={...u[i],done:e.target.checked};setLogForm({...logForm,exercises:u})}} style={{width:18,height:18,accentColor:"#1a1a1a"}}/>
              <div><div style={{fontSize:14,fontWeight:600}}>{ex.name}</div><div style={{fontSize:11,color:"#999"}}>{isCardio ? `${ex.muscle} kms · ${ex.sets} min · ${ex.reps} BPM` : `${ex.muscle} · ${ex.sets}×${ex.reps}`}</div></div>
            </div>
            {ex.done&&<div style={{display:"flex",gap:8,marginTop:4}}>
              {isCardio ? 
                [["Distance (kms)","muscle","text"],["Temps (min)","actualSets","text"],["Heartrate (BPM)","actualReps","text"]].map(([l,k,t])=><div key={k} style={{flex:1}}>
                  <label style={{fontSize:11,color:"#999",fontWeight:600}}>{l}</label>
                  <input type={t} value={ex[k]} placeholder="—" onChange={e=>{const u=[...logForm.exercises];u[i]={...u[i],[k]:e.target.value};setLogForm({...logForm,exercises:u})}} style={{padding:"8px 10px",fontSize:13}}/>
                </div>)
              :
                [["Séries","actualSets","number"],["Reps","actualReps","text"],["Poids (kg)","weight","text"]].map(([l,k,t])=><div key={k} style={{flex:1}}>
                  <label style={{fontSize:11,color:"#999",fontWeight:600}}>{l}</label>
                  <input type={t} value={ex[k]} placeholder={k==="weight"?"—":""} onChange={e=>{const u=[...logForm.exercises];u[i]={...u[i],[k]:t==="number"?(parseInt(e.target.value)||0):e.target.value};setLogForm({...logForm,exercises:u})}} style={{padding:"8px 10px",fontSize:13}}/>
                </div>)
              }
            </div>}
          </div>
        })}
        <div className="cd"><h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700}}>Comment tu te sens ?</h3>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>{[1,2,3,4,5].map(f=><button key={f} onClick={()=>setLogForm({...logForm,feeling:f})} style={{fontSize:28,background:logForm.feeling===f?"#f0eeea":"transparent",border:logForm.feeling===f?"2px solid #1a1a1a":"2px solid transparent",borderRadius:12,padding:"8px 12px",cursor:"pointer",transition:"all .15s"}}>{feel[f]}</button>)}</div>
        </div>
        <div className="cd"><h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700}}>Notes (optionnel)</h3><textarea value={logForm.notes} onChange={e=>setLogForm({...logForm,notes:e.target.value})} placeholder="Douleurs, sensations..." rows={3} style={{resize:"vertical"}}/></div>
        <button className="bt bp" onClick={saveLog} style={{width:"100%",marginTop:8,fontSize:16,padding:16}}>✅ Valider ma séance</button>
      </div>}
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
