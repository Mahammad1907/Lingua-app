import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const questions = [
  {
    question: 'What ___ your name?',
    options: ['is', 'are', 'am', 'be'],
    correct: 0,
  },
  {
    question: 'I ___ from Azerbaijan.',
    options: ['is', 'are', 'am', 'be'],
    correct: 2,
  },
  {
    question: 'She ___ to school every day.',
    options: ['go', 'goes', 'going', 'went'],
    correct: 1,
  },
  {
    question: 'Yesterday, I ___ a movie.',
    options: ['watch', 'watches', 'watched', 'watching'],
    correct: 2,
  },
  {
    question: 'I have ___ here for 2 years.',
    options: ['live', 'lived', 'living', 'lives'],
    correct: 1,
  },
  {
    question: 'If I ___ rich, I would travel.',
    options: ['am', 'was', 'were', 'be'],
    correct: 2,
  },
  {
    question: 'The book ___ by him last year.',
    options: ['write', 'wrote', 'was written', 'is written'],
    correct: 2,
  },
  {
    question: 'I wish I ___ more time.',
    options: ['have', 'had', 'having', 'has'],
    correct: 1,
  },
  {
    question: 'She said she ___ come tomorrow.',
    options: ['will', 'would', 'can', 'may'],
    correct: 1,
  },
  {
    question: 'Hardly ___ entered when the phone rang.',
    options: ['I had', 'had I', 'I have', 'have I'],
    correct: 1,
  },
];

export default function Placement() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index: number) => {
    setSelected(index);
  };

  const handleNext = async () => {
    if (selected === null) return;

    const isCorrect = selected === questions[currentQ].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      await saveResult(newScore);
      setFinished(true);
    }
  };

  const saveResult = async (finalScore: number) => {
    let level = 'A1';
    const percent = (finalScore / questions.length) * 100;

    if (percent >= 90) level = 'C1';
    else if (percent >= 75) level = 'B2';
    else if (percent >= 60) level = 'B1';
    else if (percent >= 40) level = 'A2';
    else level = 'A1';

    await AsyncStorage.setItem('user_level', level);
    await AsyncStorage.setItem('placement_score', finalScore.toString());
  };

  const handleFinish = () => {
    router.replace('/onboarding/welcome');
  };

  // Nəticə ekranı
  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    let level = 'A1';
    if (percent >= 90) level = 'C1';
    else if (percent >= 75) level = 'B2';
    else if (percent >= 60) level = 'B1';
    else if (percent >= 40) level = 'A2';

    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Test bitdi!</Text>
        <Text style={styles.score}>
          {score} / {questions.length}
        </Text>
        <Text style={styles.percent}>{percent}%</Text>

        <View style={styles.levelBox}>
          <Text style={styles.levelLabel}>Sənin səviyyən:</Text>
          <Text style={styles.levelValue}>{level}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>Davam et</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Test ekranı
  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: true }} />
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQ + 1} / {questions.length}
        </Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.questionNumber}>Sual {currentQ + 1}</Text>
          <Text style={styles.question}>{q.question}</Text>

          {q.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selected === index && styles.optionSelected,
              ]}
              onPress={() => handleAnswer(index)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === index && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.button,
            selected === null && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={selected === null}
        >
          <Text style={styles.buttonText}>
            {currentQ + 1 === questions.length ? 'Bitir' : 'Növbəti'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 30,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 4,
  },
  progressText: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 30,
  },
  scrollContent: { flexGrow: 1 },
  questionNumber: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  question: {
    fontSize: 26,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 40,
    lineHeight: 36,
  },
  optionButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  optionSelected: {
    borderColor: '#4ade80',
    backgroundColor: '#1a2a1a',
  },
  optionText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4ade80',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ade80',
    textAlign: 'center',
  },
  percent: {
    fontSize: 24,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  levelBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  levelLabel: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 10,
  },
  levelValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4ade80',
    textAlign: 'center',
  },
});