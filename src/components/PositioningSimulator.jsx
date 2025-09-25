import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const PositioningSimulator = ({ uniqueFeatures, commonFeatures, personas, onPersonaGenerated }) => {
    const canvasRef = useRef();
    const p5Instance = useRef();
    const [simulationState, setSimulationState] = useState('idle');
    const [currentMode, setCurrentMode] = useState('demo');
    const [productDescription, setProductDescription] = useState('');
    const [showAnalyzer, setShowAnalyzer] = useState(true);
    const [showAttributes, setShowAttributes] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const demoPersonas = [
        {
            personaName: "Ideal Adopter",
            attributes: [
                { name: "Unique A", type: 'unique', value: 9 },
                { name: "Unique B", type: 'unique', value: 8 },
                { name: "Common X", type: 'common', value: 5 },
                { name: "Common Y", type: 'common', value: 4 }
            ]
        },
        {
            personaName: "Status Quo Buyer",
            attributes: [
                { name: "Unique A", type: 'unique', value: 2 },
                { name: "Unique B", type: 'unique', value: 3 },
                { name: "Common X", type: 'common', value: 9 },
                { name: "Common Y", type: 'common', value: 8 }
            ]
        },
        {
            personaName: "Bargain Hunter",
            attributes: [
                { name: "Unique A", type: 'unique', value: 6 },
                { name: "Unique B", type: 'unique', value: 5 },
                { name: "Common X", type: 'common', value: 6 },
                { name: "Common Y", type: 'common', value: 7 }
            ]
        },
        {
            personaName: "Legacy Loyalist",
            attributes: [
                { name: "Unique A", type: 'unique', value: 1 },
                { name: "Unique B", type: 'unique', value: 1 },
                { name: "Common X", type: 'common', value: 10 },
                { name: "Common Y", type: 'common', value: 9 }
            ]
        },
        {
            personaName: "Indifferent Buyer",
            attributes: [
                { name: "Unique A", type: 'unique', value: 1 },
                { name: "Unique B", type: 'unique', value: 2 },
                { name: "Common X", type: 'common', value: 3 },
                { name: "Common Y", type: 'common', value: 4 }
            ]
        }
    ];

    useEffect(() => {
        const sketch = (p) => {
            let companies = [];
            let targetZone;
            let companyColors;
            let animationInterval;

            p.setup = () => {
                const canvasWidth = Math.min(800, window.innerWidth * 0.9);
                const canvasHeight = canvasWidth * 0.75;

                const canvas = p.createCanvas(canvasWidth, canvasHeight);
                canvas.parent(canvasRef.current);
                p.frameRate(60);

                companyColors = [
                    p.color(59, 130, 246),
                    p.color(16, 185, 129),
                    p.color(239, 68, 68),
                    p.color(139, 92, 246),
                    p.color(245, 158, 11)
                ];

                targetZone = { x: p.width / 2, y: 0, w: p.width / 2, h: p.height / 2 };
                resetSimulation();
            };

            p.draw = () => {
                p.background(255);
                drawGrid();

                if (currentMode === 'demo' || simulationState === 'finished') {
                    highlightTargetZone();
                }

                for (const company of companies) {
                    company.display();
                }

                drawLabels();
            };

            const drawGrid = () => {
                p.stroke(226, 232, 240);
                p.strokeWeight(2);
                p.line(p.width / 2, 0, p.width / 2, p.height);
                p.line(0, p.height / 2, p.width, p.height / 2);
            };

            const drawLabels = () => {
                p.noStroke();
                p.fill(100, 116, 139);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(18);

                p.push();
                p.translate(25, p.height / 4);
                p.rotate(-p.HALF_PI);
                p.text("High Customer Value", 0, 0);
                p.pop();

                p.push();
                p.translate(25, p.height * 3 / 4);
                p.rotate(-p.HALF_PI);
                p.text("Low Customer Value", 0, 0);
                p.pop();

                p.text("Common Attributes", p.width / 4, p.height - 30);
                p.text("Your Unique Attributes", p.width * 3 / 4, p.height - 30);
            };

            const highlightTargetZone = () => {
                p.fill(251, 191, 36, 20);
                p.stroke(251, 191, 36, 100);
                p.strokeWeight(2);
                p.rect(targetZone.x, targetZone.y, targetZone.w, targetZone.h);
            };

            const createCompaniesFromPersonas = (personasData) => {
                companies = personasData.map((persona, index) => {
                    const company = new Company(persona.personaName, companyColors[index % companyColors.length]);
                    persona.attributes.forEach(attr => {
                        const valueY = p.map(attr.value, 0, 10, p.height * 0.95, p.height * 0.05);
                        const typeX = (attr.type === 'unique') ?
                            p.random(p.width * 0.55, p.width * 0.95) :
                            p.random(p.width * 0.05, p.width * 0.45);
                        company.addAttribute(typeX, valueY, attr.name, attr.type);
                    });
                    return company;
                });
            };

            const analyzeAndHighlightIdealCompanies = () => {
                for (const company of companies) {
                    company.isIdeal = false;
                    let uniqueValueScore = 0;
                    let uniqueAttrCount = 0;

                    for (const attr of company.attributes) {
                        if (attr.type === 'unique') {
                            uniqueAttrCount++;
                            if (attr.y < p.height / 2) {
                                uniqueValueScore++;
                            }
                        }
                    }

                    if (uniqueAttrCount > 0 && (uniqueValueScore / uniqueAttrCount) >= 0.5) {
                        company.isIdeal = true;
                    }
                }
            };

            const runAnimation = (onComplete) => {
                if (simulationState === 'simulating') return;
                setSimulationState('simulating');

                let companyIndex = 0;
                animationInterval = setInterval(() => {
                    if (companyIndex < companies.length) {
                        companies[companyIndex].visible = true;
                        companyIndex++;
                    } else {
                        clearInterval(animationInterval);
                        setSimulationState('finished');
                        if (onComplete) {
                            onComplete();
                        }
                    }
                }, 600);
            };

            const resetSimulation = () => {
                clearInterval(animationInterval);
                setSimulationState('idle');
                companies = [];

                if (currentMode === 'demo') {
                    createCompaniesFromPersonas(demoPersonas);
                }
            };

            const startSimulation = () => {
                runAnimation(() => {
                    analyzeAndHighlightIdealCompanies();
                });
            };

            const runAiSimulation = (personasData) => {
                resetSimulation();
                createCompaniesFromPersonas(personasData);
                runAnimation(() => {
                    analyzeAndHighlightIdealCompanies();
                });
            };

            class Company {
                constructor(name, color) {
                    this.name = name;
                    this.color = color;
                    this.attributes = [];
                    this.visible = false;
                    this.isIdeal = false;
                }

                addAttribute(x, y, name, type) {
                    this.attributes.push({ x, y, name, type });
                }

                display() {
                    if (!this.visible) return;

                    for (const attr of this.attributes) {
                        if (this.isIdeal) {
                            p.fill(251, 191, 36, 150);
                            p.noStroke();
                            p.ellipse(attr.x, attr.y, 16, 16);
                        }

                        p.fill(this.color);
                        p.noStroke();
                        p.ellipse(attr.x, attr.y, 10, 10);
                    }
                }
            }

            // Expose methods to parent component
            p.startSimulation = startSimulation;
            p.runAiSimulation = runAiSimulation;
            p.resetSimulation = resetSimulation;
        };

        p5Instance.current = new p5(sketch);

        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, [currentMode, simulationState]);

    const handleMarketAnalysis = async () => {
        if (!productDescription.trim()) {
            alert('Please describe your product to use the AI Market Analyzer.');
            return;
        }

        setIsAnalyzing(true);

        const prompt = `
            You are a world-class market analyst and B2B SaaS positioning expert.
            A startup founder has provided a description of their product.
            Your task is to analyze this description and the market it implies.
            Based on your knowledge, identify a list of "Common Attributes" (features that are table stakes in this market) and a list of "Unique Attributes" (features that appear to be the startup's key differentiators).

            Founder's Description: "${productDescription}"

            Return ONLY a valid JSON object with the following structure:
            {
              "common_attributes": ["Attribute 1", "Attribute 2", ...],
              "unique_attributes": ["Attribute 1", "Attribute 2", ...]
            }
        `;

        try {
            const response = await fetch('/api/gemini-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();

            if (onPersonaGenerated) {
                onPersonaGenerated({
                    uniqueFeatures: data.unique_attributes.join(', '),
                    commonFeatures: data.common_attributes.join(', ')
                });
            }

            setShowAnalyzer(false);
            setShowAttributes(true);
        } catch (error) {
            console.error('Error calling Market Analyzer API:', error);
            alert('An error occurred during market analysis. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAiSimulation = async () => {
        if (!uniqueFeatures || !commonFeatures) {
            alert('Please fill out all feature fields to generate the AI simulation.');
            return;
        }

        setIsSimulating(true);
        setShowResults(false);

        const prompt = `
            You are a world-class venture capitalist and market positioning expert.
            A startup founder provides you with their unique and common product attributes.
            - Unique Attributes: "${uniqueFeatures}"
            - Common Attributes: "${commonFeatures}"

            Your task is to generate a realistic market simulation. Create 4-5 distinct customer personas that would exist in this market. For each persona, describe them and analyze how they would value EACH of the provided attributes.

            Return ONLY a valid JSON object with a "personas" key containing an array of persona objects.
        `;

        try {
            const response = await fetch('/api/gemini-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();

            if (p5Instance.current) {
                p5Instance.current.runAiSimulation(data.personas);
            }

            setShowResults(true);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            alert('An error occurred while generating the AI simulation. Please try again.');
        } finally {
            setIsSimulating(false);
        }
    };

    const handlePoshExample = () => {
        const poshData = {
            uniqueFeatures: 'Predictive Analytics and Machine Learning, Enhanced Automated Problem Resolution, Cross-Platform Integration Capabilities',
            commonFeatures: 'Reactive Monitoring, Custom Dashboards, Manual Troubleshooting, Basic Alerting'
        };

        if (onPersonaGenerated) {
            onPersonaGenerated(poshData);
        }

        setShowAnalyzer(false);
        setShowAttributes(true);
        handleAiSimulation();
    };

    const switchMode = (newMode) => {
        if (currentMode === newMode) return;
        setCurrentMode(newMode);

        if (newMode === 'demo') {
            setShowAnalyzer(false);
            setShowAttributes(false);
            setShowResults(false);
        } else {
            setShowAnalyzer(true);
            setShowAttributes(false);
            setShowResults(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">The Art of Positioning</h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    This advanced simulation visualizes how different companies value your specific features.
                    Look for the colored clusters that place the highest value on your unique attributes.
                </p>
            </header>

            {/* Mode Toggle */}
            <div className="text-center mb-8">
                <div className="inline-flex rounded-lg shadow-sm">
                    <button
                        onClick={() => switchMode('demo')}
                        className={`px-6 py-3 text-base font-medium border rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                            currentMode === 'demo'
                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-blue-700'
                        }`}
                    >
                        Canned Demo
                    </button>
                    <button
                        onClick={() => switchMode('ai')}
                        className={`px-6 py-3 text-base font-medium border-t border-b border-r rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                            currentMode === 'ai'
                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-blue-700'
                        }`}
                    >
                        ✨ AI Simulator
                    </button>
                </div>
            </div>

            {/* P5 Canvas */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-6">
                <div ref={canvasRef} className="flex justify-center p-4"></div>
            </div>

            {/* Demo Controls */}
            {currentMode === 'demo' && (
                <div className="text-center mb-6">
                    <button
                        onClick={() => p5Instance.current?.startSimulation()}
                        disabled={simulationState === 'simulating'}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 mr-4"
                    >
                        Run Demo Simulation
                    </button>
                    <button
                        onClick={() => p5Instance.current?.resetSimulation()}
                        className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-slate-700"
                    >
                        Reset
                    </button>
                    {simulationState === 'finished' && (
                        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg max-w-3xl mx-auto">
                            <h3 className="font-bold text-2xl text-blue-800 mb-2">Analysis Complete</h3>
                            <p className="text-lg text-blue-700">
                                The simulation is finished. Your ideal target companies—those who value your unique features most—are now highlighted with a <span className="font-bold text-yellow-600">gold</span> halo. Focus your efforts on them!
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* AI Mode */}
            {currentMode === 'ai' && (
                <div>
                    {/* Step 1: Market Analyzer */}
                    {showAnalyzer && (
                        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200 mb-6">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Step 1: AI Market Analyzer</h2>
                            <p className="text-center text-lg text-slate-600 mb-6">
                                Struggling to define your features? Describe your product in your own words, and our AI analyst will suggest a starting point for your unique and common attributes.
                            </p>
                            <label htmlFor="product-description" className="block text-base font-medium text-slate-700 mb-1">
                                In your own words, describe your product, the problem it solves, and any competitors or alternatives you're aware of.
                            </label>
                            <textarea
                                id="product-description"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                rows="5"
                                className="w-full p-2 border border-slate-300 rounded-md text-base mb-6"
                                placeholder="e.g., We're building a tool that helps data scientists collaborate. Unlike traditional SQL notebooks, we offer real-time editing, automatic version history for queries, and AI-powered suggestions to write better code faster. Competitors are tools like Jupyter and Deepnote."
                            />
                            <div className="text-center">
                                <button
                                    onClick={handleMarketAnalysis}
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 mb-4"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze My Market'}
                                </button>
                                <div className="text-center">
                                    <button
                                        onClick={() => { setShowAnalyzer(false); setShowAttributes(true); }}
                                        className="text-base text-slate-500 hover:text-slate-700"
                                    >
                                        or, skip and enter attributes manually »
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Attribute Input */}
                    {showAttributes && (
                        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200 mb-6">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Step 2: Review Attributes & Simulate</h2>
                            <p className="text-center text-lg text-slate-600 mb-6">
                                Our AI has drafted a list of attributes based on your description. Review, edit, and then run the simulation to see how different customer personas might value them.
                            </p>

                            <div className="text-center mb-6">
                                <button
                                    onClick={handlePoshExample}
                                    className="bg-indigo-100 text-indigo-700 font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                                >
                                    See an Example: Analyze 'POSH'
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label htmlFor="unique-features" className="block text-base font-medium text-slate-700 mb-1">
                                        Your Unique Attributes (comma-separated)
                                    </label>
                                    <textarea
                                        id="unique-features"
                                        value={uniqueFeatures || ''}
                                        onChange={(e) => onPersonaGenerated && onPersonaGenerated({ uniqueFeatures: e.target.value, commonFeatures })}
                                        rows="2"
                                        className="w-full p-2 border border-slate-300 rounded-md text-base"
                                        placeholder="e.g., Real-time collaboration, AI code suggestions, Automatic versioning"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="common-features" className="block text-base font-medium text-slate-700 mb-1">
                                        Common Attributes in Market (comma-separated)
                                    </label>
                                    <textarea
                                        id="common-features"
                                        value={commonFeatures || ''}
                                        onChange={(e) => onPersonaGenerated && onPersonaGenerated({ uniqueFeatures, commonFeatures: e.target.value })}
                                        rows="2"
                                        className="w-full p-2 border border-slate-300 rounded-md text-base"
                                        placeholder="e.g., SQL notebooks, Basic charting, Data connectors"
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={handleAiSimulation}
                                    disabled={isSimulating}
                                    className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50"
                                >
                                    {isSimulating ? 'Generating...' : '✨ Generate AI Simulation'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Results Section */}
                    {showResults && personas && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                                <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">✨ AI-Powered Strategic Analysis</h2>
                                <div className="space-y-4">
                                    {personas.map((persona, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <h3 className="font-semibold text-xl text-slate-700">{persona.personaName}</h3>
                                            <p className="text-base text-slate-600 mt-1">{persona.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PositioningSimulator;