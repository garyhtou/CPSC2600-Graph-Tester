import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';

import { database } from './utils/firebase';
import { ref, get } from 'firebase/database';

export default function Home() {
	const [tests, setTests] = useState(null);
	const [testName, setTestName] = useState('');
	const [test, setTest] = useState('');
	const [gResult, setgResult] = useState('');
	const [uResult, setuResult] = useState('');
	const [matching, setMatching] = useState(false);

	useEffect(() => {
		newTest();
	}, []);

	const newTest = async () => {
		const localTests = tests;
		if (localTests === null) {
			localTests = await getTests();
		}

		const randIndex = Math.floor(
			Math.random() * Object.keys(localTests).length
		);
		const name = Object.keys(localTests)[randIndex];
		const testObj = localTests[name];
		setTestName(name);
		setTest(testObj.test);
		setgResult(testObj.results.gary);

		console.log('NEW TEST:', testObj);

		return testObj;
	};

	const getTests = async () => {
		const tests = (await get(ref(database, '/tests'))).val();
		setTests(tests);
		console.log('TESTS:', tests);
		console.log(`${Object.keys(tests).length} tests available`);
		return tests;
	};

	const handleuResult = (evt) => {
		setuResult(evt.target.value);
	};

	useEffect(() => {
		testMatching();
	}, [uResult, gResult]);

	const testMatching = () => {
		const gResultArr = gResult.split('\n');
		gResultArr = gResultArr.map((line) => line.trimEnd());
		const trimmedgResult = gResultArr.join('\n');

		const uResultArr = uResult.split('\n');
		uResultArr = uResultArr.map((line) => line.trimEnd());
		const trimmeduResult = uResultArr.join('\n');

		if (trimmedgResult === trimmeduResult) {
			setMatching(true);
		} else {
			setMatching(false);
		}
	};

	const downloadTest = () => {
		const link = document.createElement('a');
		link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(test);
		link.download = `${testName}.txt`;
		link.click();
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>CPSC 2600 Graph Tester</title>
				<meta name='description' content='Created by Gary Tou' />
			</Head>

			<main className={styles.parent}>
				<div className={styles.header}>
					<h1 className={styles.title}>CPSC 2600 Graph Tester</h1>
				</div>

				<div className={styles.test}>
					<div>
						<h3>
							Test Graph <code>({testName})</code>
						</h3>
						<button onClick={downloadTest}>Download</button>
						<pre>{test}</pre>
					</div>
				</div>
				<div className={styles.gResult}>
					<div>
						<h3>gary&apos;s Results</h3>
						<pre>{gResult}</pre>
					</div>
				</div>
				<div className={styles.uResult}>
					<div>
						<h3>Your Results</h3>
						<p>Paste em&apos; in</p>
						<textarea
							onChange={handleuResult}
							value={uResult}
							rows={15}
						></textarea>
						<div>
							<p>
								<strong>Matches gary&apos;s Results?: </strong>
								<span style={{ color: matching ? 'green' : 'red' }}>
									{matching ? 'Yes' : 'No'}
								</span>
							</p>
							<button onClick={() => newTest()}>New Test</button>
						</div>
					</div>
				</div>
				<footer className={styles.footer}>
					<a
						href='https://garytou.com/'
						target='_blank'
						rel='noopener noreferrer'
					>
						Developed by <strong>Gary Tou</strong>
					</a>
				</footer>
			</main>
		</div>
	);
}
