import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Grid,
  Paper,
  Divider,
  Tooltip,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import './SchoolCurriculumManager.css';
import {
  School,
  Add,
  Edit,
  Delete,
  ExpandMore,
  Timeline as TimelineIcon,
  Grade,
  Subject,
  CalendarToday,
  Assignment,
  Book,
  Science,
  History,
  Language,
  Math,
  Computer,
  Art,
  Music,
  PhysicalEducation,
  Business,
  Psychology,
  Medicine,
  Engineering,
  Architecture,
  Law,
  Economics,
  Philosophy,
  Sociology,
  Biology,
  Chemistry,
  Physics,
  Geography,
  Literature,
  ForeignLanguage,
  Statistics,
  Accounting,
  Marketing,
  Management,
  Finance,
  InformationTechnology,
  DataScience,
  ArtificialIntelligence,
  Cybersecurity,
  WebDevelopment,
  MobileDevelopment,
  Database,
  Networking,
  CloudComputing,
  DevOps,
  MachineLearning,
  DeepLearning,
  Blockchain,
  InternetOfThings,
  VirtualReality,
  AugmentedReality,
  Robotics,
  Automation,
  DigitalMarketing,
  GraphicDesign,
  VideoProduction,
  Photography,
  Journalism,
  Communication,
  PublicRelations,
  HumanResources,
  Operations,
  SupplyChain,
  Logistics,
  QualityAssurance,
  Research,
  Development,
  Testing,
  Deployment,
  Maintenance,
  Support,
  Training,
  Consulting,
  Freelance,
  Entrepreneurship,
  Innovation,
  Strategy,
  Planning,
  Analysis,
  Design,
  Implementation,
  Evaluation,
  Optimization,
  Monitoring,
  Reporting,
  Documentation,
  Collaboration,
  Leadership,
  Teamwork,
  ProblemSolving,
  CriticalThinking,
  Creativity,
  Adaptability,
  TimeManagement,
  Organization,
  AttentionToDetail,
  TechnicalSkills,
  SoftSkills,
  InterpersonalSkills,
  PresentationSkills,
  NegotiationSkills,
  ConflictResolution,
  DecisionMaking,
  RiskManagement,
  ProjectManagement,
  ChangeManagement,
  QualityManagement,
  PerformanceManagement,
  KnowledgeManagement,
  InformationManagement,
  DataManagement,
  ProcessManagement,
  ResourceManagement,
  StakeholderManagement,
  CommunicationManagement,
  IntegrationManagement,
  ScopeManagement,
  ScheduleManagement,
  CostManagement,
  ProcurementManagement,
  RiskManagement as RiskManagementIcon,
  QualityManagement as QualityManagementIcon,
  HumanResourceManagement,
  CommunicationsManagement,
  StakeholderManagement as StakeholderManagementIcon,
  IntegrationManagement as IntegrationManagementIcon,
  ScopeManagement as ScopeManagementIcon,
  ScheduleManagement as ScheduleManagementIcon,
  CostManagement as CostManagementIcon,
  ProcurementManagement as ProcurementManagementIcon,
} from '@mui/icons-material';

const SchoolCurriculumManager = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'course', // course, td, tp, exam, project
    subject: '',
    year: '',
    school: '',
    description: '',
    credits: 0,
    grade: null,
    status: 'pending', // pending, in_progress, completed, failed
    startDate: '',
    endDate: '',
    teacher: '',
    room: '',
    schedule: '',
    materials: [],
    objectives: [],
    prerequisites: [],
    tags: [],
  });

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('schoolCurriculum');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSchools(data.schools || []);
      } catch (error) {
        console.error('Erreur lors du chargement du cursus:', error);
      }
    }
  }, []);

  // Sauvegarder les données
  const saveData = () => {
    const data = { schools, lastModified: new Date().toISOString() };
    localStorage.setItem('schoolCurriculum', JSON.stringify(data));
  };

  // Matières prédéfinies avec icônes
  const subjects = [
    { name: 'Mathématiques', icon: <Math />, color: '#2196f3' },
    { name: 'Physique', icon: <Science />, color: '#ff9800' },
    { name: 'Chimie', icon: <Science />, color: '#4caf50' },
    { name: 'Biologie', icon: <Biology />, color: '#8bc34a' },
    { name: 'Informatique', icon: <Computer />, color: '#9c27b0' },
    { name: 'Histoire', icon: <History />, color: '#795548' },
    { name: 'Géographie', icon: <Geography />, color: '#607d8b' },
    { name: 'Littérature', icon: <Literature />, color: '#e91e63' },
    { name: 'Langues', icon: <Language />, color: '#00bcd4' },
    { name: 'Philosophie', icon: <Philosophy />, color: '#673ab7' },
    { name: 'Économie', icon: <Economics />, color: '#ff5722' },
    { name: 'Droit', icon: <Law />, color: '#3f51b5' },
    { name: 'Médecine', icon: <Medicine />, color: '#f44336' },
    { name: 'Ingénierie', icon: <Engineering />, color: '#009688' },
    { name: 'Architecture', icon: <Architecture />, color: '#ffc107' },
    { name: 'Psychologie', icon: <Psychology />, color: '#e91e63' },
    { name: 'Sociologie', icon: <Sociology />, color: '#9e9e9e' },
    { name: 'Statistiques', icon: <Statistics />, color: '#2196f3' },
    { name: 'Comptabilité', icon: <Accounting />, color: '#4caf50' },
    { name: 'Marketing', icon: <Marketing />, color: '#ff9800' },
    { name: 'Management', icon: <Management />, color: '#607d8b' },
    { name: 'Finance', icon: <Finance />, color: '#8bc34a' },
    { name: 'Technologies de l\'Information', icon: <InformationTechnology />, color: '#9c27b0' },
    { name: 'Science des Données', icon: <DataScience />, color: '#00bcd4' },
    { name: 'Intelligence Artificielle', icon: <ArtificialIntelligence />, color: '#673ab7' },
    { name: 'Cybersécurité', icon: <Cybersecurity />, color: '#f44336' },
    { name: 'Développement Web', icon: <WebDevelopment />, color: '#ff5722' },
    { name: 'Développement Mobile', icon: <MobileDevelopment />, color: '#009688' },
    { name: 'Base de Données', icon: <Database />, color: '#795548' },
    { name: 'Réseaux', icon: <Networking />, color: '#607d8b' },
    { name: 'Cloud Computing', icon: <CloudComputing />, color: '#2196f3' },
    { name: 'DevOps', icon: <DevOps />, color: '#ff9800' },
    { name: 'Machine Learning', icon: <MachineLearning />, color: '#4caf50' },
    { name: 'Deep Learning', icon: <DeepLearning />, color: '#8bc34a' },
    { name: 'Blockchain', icon: <Blockchain />, color: '#9c27b0' },
    { name: 'Internet des Objets', icon: <InternetOfThings />, color: '#00bcd4' },
    { name: 'Réalité Virtuelle', icon: <VirtualReality />, color: '#673ab7' },
    { name: 'Réalité Augmentée', icon: <AugmentedReality />, color: '#f44336' },
    { name: 'Robotique', icon: <Robotics />, color: '#ff5722' },
    { name: 'Automatisation', icon: <Automation />, color: '#009688' },
    { name: 'Marketing Digital', icon: <DigitalMarketing />, color: '#795548' },
    { name: 'Design Graphique', icon: <GraphicDesign />, color: '#607d8b' },
    { name: 'Production Vidéo', icon: <VideoProduction />, color: '#2196f3' },
    { name: 'Photographie', icon: <Photography />, color: '#ff9800' },
    { name: 'Journalisme', icon: <Journalism />, color: '#4caf50' },
    { name: 'Communication', icon: <Communication />, color: '#8bc34a' },
    { name: 'Relations Publiques', icon: <PublicRelations />, color: '#9c27b0' },
    { name: 'Ressources Humaines', icon: <HumanResources />, color: '#00bcd4' },
    { name: 'Opérations', icon: <Operations />, color: '#673ab7' },
    { name: 'Chaîne d\'Approvisionnement', icon: <SupplyChain />, color: '#f44336' },
    { name: 'Logistique', icon: <Logistics />, color: '#ff5722' },
    { name: 'Assurance Qualité', icon: <QualityAssurance />, color: '#009688' },
    { name: 'Recherche', icon: <Research />, color: '#795548' },
    { name: 'Développement', icon: <Development />, color: '#607d8b' },
    { name: 'Tests', icon: <Testing />, color: '#2196f3' },
    { name: 'Déploiement', icon: <Deployment />, color: '#ff9800' },
    { name: 'Maintenance', icon: <Maintenance />, color: '#4caf50' },
    { name: 'Support', icon: <Support />, color: '#8bc34a' },
    { name: 'Formation', icon: <Training />, color: '#9c27b0' },
    { name: 'Consulting', icon: <Consulting />, color: '#00bcd4' },
    { name: 'Freelance', icon: <Freelance />, color: '#673ab7' },
    { name: 'Entrepreneuriat', icon: <Entrepreneurship />, color: '#f44336' },
    { name: 'Innovation', icon: <Innovation />, color: '#ff5722' },
    { name: 'Stratégie', icon: <Strategy />, color: '#009688' },
    { name: 'Planification', icon: <Planning />, color: '#795548' },
    { name: 'Analyse', icon: <Analysis />, color: '#607d8b' },
    { name: 'Conception', icon: <Design />, color: '#2196f3' },
    { name: 'Implémentation', icon: <Implementation />, color: '#ff9800' },
    { name: 'Évaluation', icon: <Evaluation />, color: '#4caf50' },
    { name: 'Optimisation', icon: <Optimization />, color: '#8bc34a' },
    { name: 'Surveillance', icon: <Monitoring />, color: '#9c27b0' },
    { name: 'Rapportage', icon: <Reporting />, color: '#00bcd4' },
    { name: 'Documentation', icon: <Documentation />, color: '#673ab7' },
    { name: 'Collaboration', icon: <Collaboration />, color: '#f44336' },
    { name: 'Leadership', icon: <Leadership />, color: '#ff5722' },
    { name: 'Travail d\'Équipe', icon: <Teamwork />, color: '#009688' },
    { name: 'Résolution de Problèmes', icon: <ProblemSolving />, color: '#795548' },
    { name: 'Pensée Critique', icon: <CriticalThinking />, color: '#607d8b' },
    { name: 'Créativité', icon: <Creativity />, color: '#2196f3' },
    { name: 'Adaptabilité', icon: <Adaptability />, color: '#ff9800' },
    { name: 'Communication', icon: <Communication />, color: '#4caf50' },
    { name: 'Gestion du Temps', icon: <TimeManagement />, color: '#8bc34a' },
    { name: 'Organisation', icon: <Organization />, color: '#9c27b0' },
    { name: 'Attention aux Détails', icon: <AttentionToDetail />, color: '#00bcd4' },
    { name: 'Compétences Techniques', icon: <TechnicalSkills />, color: '#673ab7' },
    { name: 'Compétences Douces', icon: <SoftSkills />, color: '#f44336' },
    { name: 'Compétences Interpersonnelles', icon: <InterpersonalSkills />, color: '#ff5722' },
    { name: 'Compétences de Présentation', icon: <PresentationSkills />, color: '#009688' },
    { name: 'Compétences de Négociation', icon: <NegotiationSkills />, color: '#795548' },
    { name: 'Résolution de Conflits', icon: <ConflictResolution />, color: '#607d8b' },
    { name: 'Prise de Décision', icon: <DecisionMaking />, color: '#2196f3' },
    { name: 'Gestion des Risques', icon: <RiskManagementIcon />, color: '#ff9800' },
    { name: 'Gestion de Projet', icon: <ProjectManagement />, color: '#4caf50' },
    { name: 'Gestion du Changement', icon: <ChangeManagement />, color: '#8bc34a' },
    { name: 'Gestion de la Qualité', icon: <QualityManagementIcon />, color: '#9c27b0' },
    { name: 'Gestion de la Performance', icon: <PerformanceManagement />, color: '#00bcd4' },
    { name: 'Gestion des Connaissances', icon: <KnowledgeManagement />, color: '#673ab7' },
    { name: 'Gestion de l\'Information', icon: <InformationManagement />, color: '#f44336' },
    { name: 'Gestion des Données', icon: <DataManagement />, color: '#ff5722' },
    { name: 'Gestion des Processus', icon: <ProcessManagement />, color: '#009688' },
    { name: 'Gestion des Ressources', icon: <ResourceManagement />, color: '#795548' },
    { name: 'Gestion des Parties Prenantes', icon: <StakeholderManagementIcon />, color: '#607d8b' },
    { name: 'Gestion de la Communication', icon: <CommunicationsManagement />, color: '#2196f3' },
    { name: 'Gestion de l\'Intégration', icon: <IntegrationManagementIcon />, color: '#ff9800' },
    { name: 'Gestion de la Portée', icon: <ScopeManagementIcon />, color: '#4caf50' },
    { name: 'Gestion de l\'Échéancier', icon: <ScheduleManagementIcon />, color: '#8bc34a' },
    { name: 'Gestion des Coûts', icon: <CostManagementIcon />, color: '#9c27b0' },
    { name: 'Gestion des Achats', icon: <ProcurementManagementIcon />, color: '#00bcd4' },
  ];

  // Types de cours
  const courseTypes = [
    { value: 'course', label: 'Cours', icon: <Book /> },
    { value: 'td', label: 'Travaux Dirigés', icon: <Assignment /> },
    { value: 'tp', label: 'Travaux Pratiques', icon: <Science /> },
    { value: 'exam', label: 'Examen', icon: <Grade /> },
    { value: 'project', label: 'Projet', icon: <Assignment /> },
  ];

  // Statuts
  const statuses = [
    { value: 'pending', label: 'En attente', color: 'default' },
    { value: 'in_progress', label: 'En cours', color: 'primary' },
    { value: 'completed', label: 'Terminé', color: 'success' },
    { value: 'failed', label: 'Échoué', color: 'error' },
  ];

  // Calculer les statistiques
  const statistics = useMemo(() => {
    const allItems = schools.flatMap(school => 
      school.years?.flatMap(year => 
        year.subjects?.flatMap(subject => subject.items || []) || []
      ) || []
    );

    const totalItems = allItems.length;
    const completedItems = allItems.filter(item => item.status === 'completed').length;
    const inProgressItems = allItems.filter(item => item.status === 'in_progress').length;
    const pendingItems = allItems.filter(item => item.status === 'pending').length;
    const failedItems = allItems.filter(item => item.status === 'failed').length;

    const totalCredits = allItems.reduce((sum, item) => sum + (item.credits || 0), 0);
    const earnedCredits = allItems
      .filter(item => item.status === 'completed')
      .reduce((sum, item) => sum + (item.credits || 0), 0);

    const averageGrade = allItems
      .filter(item => item.grade && item.status === 'completed')
      .reduce((sum, item) => sum + item.grade, 0) / 
      allItems.filter(item => item.grade && item.status === 'completed').length || 0;

    return {
      totalItems,
      completedItems,
      inProgressItems,
      pendingItems,
      failedItems,
      totalCredits,
      earnedCredits,
      averageGrade: averageGrade || 0,
      completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
    };
  }, [schools]);

  // Obtenir l'icône d'une matière
  const getSubjectIcon = (subjectName) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject ? subject.icon : <Subject />;
  };

  // Obtenir la couleur d'une matière
  const getSubjectColor = (subjectName) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject ? subject.color : '#666666';
  };

  // Obtenir l'icône d'un type de cours
  const getCourseTypeIcon = (type) => {
    const courseType = courseTypes.find(t => t.value === type);
    return courseType ? courseType.icon : <Book />;
  };

  // Obtenir le statut
  const getStatusInfo = (status) => {
    const statusInfo = statuses.find(s => s.value === status);
    return statusInfo || { label: 'Inconnu', color: 'default' };
  };

  // Ajouter un nouvel élément
  const addItem = () => {
    if (!newItem.name.trim() || !newItem.subject || !newItem.year || !newItem.school) return;

    const item = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date().toISOString(),
    };

    // Trouver ou créer l'école
    let school = schools.find(s => s.name === newItem.school);
    if (!school) {
      school = { name: newItem.school, years: [] };
      setSchools(prev => [...prev, school]);
    }

    // Trouver ou créer l'année
    let year = school.years?.find(y => y.name === newItem.year);
    if (!year) {
      year = { name: newItem.year, subjects: [] };
      if (!school.years) school.years = [];
      school.years.push(year);
    }

    // Trouver ou créer la matière
    let subject = year.subjects?.find(s => s.name === newItem.subject);
    if (!subject) {
      subject = { name: newItem.subject, items: [] };
      if (!year.subjects) year.subjects = [];
      year.subjects.push(subject);
    }

    // Ajouter l'élément
    if (!subject.items) subject.items = [];
    subject.items.push(item);

    setNewItem({
      name: '',
      type: 'course',
      subject: '',
      year: '',
      school: '',
      description: '',
      credits: 0,
      grade: null,
      status: 'pending',
      startDate: '',
      endDate: '',
      teacher: '',
      room: '',
      schedule: '',
      materials: [],
      objectives: [],
      prerequisites: [],
      tags: [],
    });
    setShowAddDialog(false);
    saveData();
  };

  // Supprimer un élément
  const removeItem = (itemId) => {
    const updatedSchools = schools.map(school => ({
      ...school,
      years: school.years?.map(year => ({
        ...year,
        subjects: year.subjects?.map(subject => ({
          ...subject,
          items: subject.items?.filter(item => item.id !== itemId) || []
        })) || []
      })) || []
    }));
    setSchools(updatedSchools);
    saveData();
  };

  // Filtrer les éléments
  const filteredItems = useMemo(() => {
    let items = schools.flatMap(school => 
      school.years?.flatMap(year => 
        year.subjects?.flatMap(subject => 
          (subject.items || []).map(item => ({
            ...item,
            school: school.name,
            year: year.name,
            subject: subject.name,
          }))
        ) || []
      ) || []
    );

    if (selectedSchool) {
      items = items.filter(item => item.school === selectedSchool);
    }
    if (selectedYear) {
      items = items.filter(item => item.year === selectedYear);
    }
    if (selectedSubject) {
      items = items.filter(item => item.subject === selectedSubject);
    }

    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [schools, selectedSchool, selectedYear, selectedSubject]);

  return (
    <div className="curriculum-container">
      <div className="curriculum-header fade-in-up">
        <h1>🎓 Gestion du Cursus Scolaire</h1>
        <p>Organisez et suivez votre parcours académique avec style</p>
      </div>

      {/* Statistiques globales */}
      <div className="stats-grid fade-in-up">
        <div className="stat-card pulse">
          <div className="stat-number">{statistics.totalItems}</div>
          <div className="stat-label">Total des cours</div>
        </div>
        <div className="stat-card pulse">
          <div className="stat-number">{statistics.completedItems}</div>
          <div className="stat-label">Cours terminés</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${statistics.completionRate}%` }}
            ></div>
          </div>
        </div>
        <div className="stat-card pulse">
          <div className="stat-number">{statistics.earnedCredits}/{statistics.totalCredits}</div>
          <div className="stat-label">Crédits obtenus</div>
        </div>
        <div className="stat-card pulse">
          <div className="stat-number">{statistics.averageGrade.toFixed(1)}/20</div>
          <div className="stat-label">Moyenne générale</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-container fade-in-up">
        <div className="filters-grid">
          <select 
            className="filter-select"
            value={selectedSchool || ''}
            onChange={(e) => setSelectedSchool(e.target.value || null)}
          >
            <option value="">Toutes les écoles</option>
            {schools.map(school => (
              <option key={school.name} value={school.name}>
                {school.name}
              </option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value || null)}
          >
            <option value="">Toutes les années</option>
            {schools
              .filter(school => !selectedSchool || school.name === selectedSchool)
              .flatMap(school => school.years || [])
              .map(year => (
                <option key={year.name} value={year.name}>
                  {year.name}
                </option>
              ))}
          </select>
          
          <select 
            className="filter-select"
            value={selectedSubject || ''}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
          >
            <option value="">Toutes les matières</option>
            {subjects.map(subject => (
              <option key={subject.name} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
          
          <button 
            className="styled-button"
            onClick={() => setShowAddDialog(true)}
          >
            ➕ Ajouter un cours
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="tabs-container fade-in-up">
        <button 
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => setActiveTab(0)}
        >
          📚 Liste des cours
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          📅 Chronologie
        </button>
        <button 
          className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          📊 Progression
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <div className="courses-grid fade-in-up">
          {filteredItems.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'white', fontSize: '1.2rem' }}>
              📚 Aucun cours trouvé. Ajoutez votre premier cours pour commencer.
            </div>
          ) : (
            filteredItems.map(item => (
              <div className="course-card" key={item.id}>
                <div className="course-header">
                  <div 
                    className="course-avatar"
                    style={{ backgroundColor: getSubjectColor(item.subject) }}
                  >
                    {getSubjectIcon(item.subject)}
                  </div>
                  <div>
                    <div className="course-title">{item.name}</div>
                    <div className="course-subtitle">{item.school} • {item.year}</div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#f44336', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      marginLeft: 'auto'
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div className="course-type">
                  {getCourseTypeIcon(item.type)}
                  <span style={{ marginLeft: '8px' }}>
                    {courseTypes.find(t => t.value === item.type)?.label}
                  </span>
                </div>

                {item.description && (
                  <div className="course-description">{item.description}</div>
                )}

                <div className="course-tags">
                  <span className={`course-status status-${item.status}`}>
                    {getStatusInfo(item.status).label}
                  </span>
                  {item.credits > 0 && (
                    <span className="course-tag">{item.credits} crédits</span>
                  )}
                  {item.grade && (
                    <span className="course-tag">{item.grade}/20</span>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="course-tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="course-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="timeline-container fade-in-up">
          {filteredItems.map((item, index) => (
            <div className="timeline-item" key={item.id}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: getSubjectColor(item.subject),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    color: 'white'
                  }}
                >
                  {getSubjectIcon(item.subject)}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>
                    {item.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {item.description && (
                <div style={{ color: '#555', marginBottom: '10px' }}>{item.description}</div>
              )}
              <span className={`course-status status-${item.status}`}>
                {getStatusInfo(item.status).label}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 2 && (
        <div className="progression-container fade-in-up">
          <div className="progression-card">
            <div className="progression-title">📈 Progression par matière</div>
            {subjects.slice(0, 10).map(subject => {
              const subjectItems = filteredItems.filter(item => item.subject === subject.name);
              const completedItems = subjectItems.filter(item => item.status === 'completed').length;
              const progress = subjectItems.length > 0 ? (completedItems / subjectItems.length) * 100 : 0;
              
              return (
                <div className="progress-item" key={subject.name}>
                  <div className="progress-header">
                    <div className="progress-label">{subject.name}</div>
                    <div className="progress-value">{completedItems}/{subjectItems.length}</div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="progression-card">
            <div className="progression-title">📊 Statut des cours</div>
            {statuses.map(status => {
              const count = filteredItems.filter(item => item.status === status.value).length;
              const percentage = filteredItems.length > 0 ? (count / filteredItems.length) * 100 : 0;
              
              return (
                <div className="progress-item" key={status.value}>
                  <div className="progress-header">
                    <div className="progress-label">{status.label}</div>
                    <div className="progress-value">{count} ({percentage.toFixed(1)}%)</div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dialog d'ajout stylé */}
      {showAddDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '1.8rem' }}>➕ Ajouter un cours</h2>
              <button 
                onClick={() => setShowAddDialog(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <input
                type="text"
                placeholder="Nom du cours"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  {courseTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={newItem.subject}
                  onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Sélectionner une matière</option>
                  {subjects.map(subject => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="École"
                  value={newItem.school}
                  onChange={(e) => setNewItem({ ...newItem, school: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
                
                <input
                  type="text"
                  placeholder="Année (ex: 2023-2024)"
                  value={newItem.year}
                  onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <textarea
                placeholder="Description du cours"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows={3}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="number"
                  placeholder="Crédits"
                  value={newItem.credits}
                  onChange={(e) => setNewItem({ ...newItem, credits: Number(e.target.value) })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
                
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="date"
                  value={newItem.startDate}
                  onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
                
                <input
                  type="date"
                  value={newItem.endDate}
                  onChange={(e) => setNewItem({ ...newItem, endDate: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Enseignant"
                  value={newItem.teacher}
                  onChange={(e) => setNewItem({ ...newItem, teacher: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
                
                <input
                  type="text"
                  placeholder="Salle"
                  value={newItem.room}
                  onChange={(e) => setNewItem({ ...newItem, room: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <input
                type="text"
                placeholder="Tags (séparés par des virgules)"
                value={newItem.tags.join(', ')}
                onChange={(e) => setNewItem({ 
                  ...newItem, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              marginTop: '25px'
            }}>
              <button
                onClick={() => setShowAddDialog(false)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '25px',
                  backgroundColor: 'white',
                  color: '#666',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Annuler
              </button>
              <button
                onClick={addItem}
                disabled={!newItem.name.trim() || !newItem.subject || !newItem.year || !newItem.school}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '25px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (!newItem.name.trim() || !newItem.subject || !newItem.year || !newItem.school) ? 0.5 : 1
                }}
              >
                Ajouter le cours
              </button>
            </div>
          </div>
                 </div>
       )}
     </div>
   );
 };

export default SchoolCurriculumManager; 