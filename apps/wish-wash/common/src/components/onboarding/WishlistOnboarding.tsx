import { Button, clsx, H1, H2, P, Progress, TextArea } from '@a-type/ui';
import { useState } from 'react';
import { OnboardingQuestion, onboardingQuestions } from './questions.js';

export interface WishlistOnboardingProps {
	answeredQuestions?: string[];
	onAnswers: (answers: Map<OnboardingQuestion, string>) => void;
	className?: string;
	thanksText: string;
}

export function WishlistOnboarding({
	answeredQuestions,
	onAnswers,
	className,
	thanksText,
}: WishlistOnboardingProps) {
	const [answers, setAnswers] = useState<Map<OnboardingQuestion, string>>(
		new Map(),
	);
	const [skipped, setSkipped] = useState<Set<OnboardingQuestion>>(new Set());
	const withoutCompleted = onboardingQuestions.filter(
		(q) => !answeredQuestions?.includes(q.id) && !skipped.has(q),
	);
	const [questionsSample, setQuestionsSample] = useState(() => {
		return shuffle(withoutCompleted).slice(0, 5);
	});
	const [sampleIndex, setSampleIndex] = useState(0);
	const [mode, setMode] = useState<'questions' | 'summary'>('questions');
	const [answer, setAnswer] = useState('');

	const currentQuestion = questionsSample[sampleIndex];

	const advance = () => {
		const nextIndex = sampleIndex + 1;
		if (nextIndex < questionsSample.length) {
			setSampleIndex(nextIndex);
		} else {
			setMode('summary');
		}
		setAnswer('');
	};

	const handleAnswer = () => {
		setAnswers((prev) => new Map(prev).set(currentQuestion, answer));
		advance();
	};

	const handleSkip = () => {
		setSkipped((prev) => new Set(prev).add(currentQuestion));
		advance();
	};

	const hasMoreQuestions = withoutCompleted.length > questionsSample.length;

	if (mode === 'summary') {
		return (
			<div className={clsx('w-full col items-stretch gap-6', className)}>
				<H1>Thanks!</H1>
				<P>{thanksText}</P>
				{hasMoreQuestions && (
					<div className="col items-start border-default rounded-lg p-4 bg-white">
						<H2>More questions are available</H2>
						<P>
							Answering more questions increases the variety and quality of
							gifts you receive.
						</P>
						<div className="row justify-start">
							<Button
								onClick={() => {
									setMode('questions');
									setSampleIndex(0);
									setQuestionsSample(shuffle(withoutCompleted).slice(0, 5));
								}}
							>
								Answer more questions
							</Button>
						</div>
					</div>
				)}
				<div className="row justify-start">
					<Button emphasis="primary" onClick={() => onAnswers(answers)}>
						Finish up
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={clsx('w-full col items-stretch gap-6', className)}>
			<div className="col items-start">
				{sampleIndex + 1}/{questionsSample.length}
				<Progress value={sampleIndex} max={questionsSample.length} />
			</div>
			<Question
				question={currentQuestion}
				key={currentQuestion.id}
				answer={answer}
				onAnswer={setAnswer}
				onCommit={(answer) => {
					setAnswer(answer);
					handleAnswer();
				}}
			/>
			<div className="w-full row items-center justify-between gap-4">
				<Button type="button" onClick={handleSkip}>
					Skip
				</Button>
				<Button emphasis="primary" onClick={handleAnswer}>
					Next
				</Button>
			</div>
		</div>
	);
}

function Question({
	question,
	answer,
	onAnswer,
	onCommit,
}: {
	question: OnboardingQuestion;
	answer: string;
	onAnswer: (answer: string) => void;
	onCommit: (answer: string) => void;
}) {
	return (
		<div className="w-full col flex-1 items-stretch gap-4">
			<label className="text-xl" htmlFor={question.id}>
				{question.question}
			</label>
			<TextArea
				className="w-full"
				id={question.id}
				autoSize
				autoFocus
				padBottomPixels={40}
				value={answer}
				onChange={(ev) => onAnswer(ev.currentTarget.value)}
				placeholders={question.suggestions}
				onKeyDown={(ev) => {
					if (ev.key === 'Enter' && !ev.shiftKey) {
						ev.preventDefault();
						onCommit(answer);
					}
				}}
			/>
		</div>
	);
}

function shuffle<T>(list: T[]) {
	for (let i = list.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[list[i], list[j]] = [list[j], list[i]];
	}
	return list;
}
