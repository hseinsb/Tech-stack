document.addEventListener('DOMContentLoaded', function() {
    // State to store user selections
    const userSelections = {
        projectType: '',
        complexity: '',
        userData: '',
        realtime: '',
        experience: ''
    };
    
    let currentStep = 1;
    const totalSteps = 5;
    
    // DOM elements
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentStepSpan = document.querySelector('.current-step');
    const totalStepsSpan = document.querySelector('.total-steps');
    
    // Initialize
    totalStepsSpan.textContent = totalSteps;
    updateNavigationButtons();
    
    // Add event listeners to option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Clear previous selection in the same step
            const currentOptions = this.parentElement.querySelectorAll('.option-btn');
            currentOptions.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to current option
            this.classList.add('selected');
            
            // Store user selection
            const value = this.getAttribute('data-value');
            
            switch (currentStep) {
                case 1:
                    userSelections.projectType = value;
                    break;
                case 2:
                    userSelections.complexity = value;
                    break;
                case 3:
                    userSelections.userData = value;
                    break;
                case 4:
                    userSelections.realtime = value;
                    break;
                case 5:
                    userSelections.experience = value;
                    break;
            }
            
            // Enable next button
            nextBtn.classList.remove('hidden');
        });
    });
    
    // Previous button event
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            steps[currentStep - 1].classList.add('hidden');
            currentStep--;
            steps[currentStep - 1].classList.remove('hidden');
            
            currentStepSpan.textContent = currentStep;
            updateNavigationButtons();
        }
    });
    
    // Next button event
    nextBtn.addEventListener('click', function() {
        if (currentStep < totalSteps) {
            steps[currentStep - 1].classList.add('hidden');
            currentStep++;
            steps[currentStep - 1].classList.remove('hidden');
            
            currentStepSpan.textContent = currentStep;
            updateNavigationButtons();
        } else {
            // Show results
            generateRecommendations();
            steps[currentStep - 1].classList.add('hidden');
            document.getElementById('results').classList.remove('hidden');
            
            // Hide navigation
            document.querySelector('.navigation').classList.add('hidden');
        }
    });
    
    // Start over button
    document.getElementById('start-over').addEventListener('click', function() {
        // Reset selections
        Object.keys(userSelections).forEach(key => {
            userSelections[key] = '';
        });
        
        // Clear selected options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Go back to first step
        document.getElementById('results').classList.add('hidden');
        currentStep = 1;
        steps[0].classList.remove('hidden');
        currentStepSpan.textContent = currentStep;
        
        // Show navigation
        document.querySelector('.navigation').classList.remove('hidden');
        updateNavigationButtons();
    });
    
    // Helper function to update navigation buttons
    function updateNavigationButtons() {
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        
        // Check if an option is selected in the current step
        const currentStepElement = steps[currentStep - 1];
        const hasSelection = Array.from(currentStepElement.querySelectorAll('.option-btn'))
            .some(btn => btn.classList.contains('selected'));
            
        if (hasSelection) {
            nextBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.add('hidden');
        }
    }
    
    // Generate recommendations based on user selections
    function generateRecommendations() {
        const frontend = recommendFrontend();
        const backend = recommendBackend();
        const database = recommendDatabase();
        
        document.getElementById('frontend-result').innerHTML = renderStackOption(frontend);
        document.getElementById('backend-result').innerHTML = backend ? renderStackOption(backend) : '<p>Your project doesn\'t seem to need a backend.</p>';
        document.getElementById('database-result').innerHTML = database ? renderStackOption(database) : '<p>Your project doesn\'t seem to need a database.</p>';
    }
    
    function renderStackOption(option) {
        return `
            <div class="stack-option">
                <div class="stack-option-name">${option.name}</div>
                <div class="stack-option-desc">${option.description}</div>
            </div>
        `;
    }
    
    function recommendFrontend() {
        const { projectType, complexity, experience } = userSelections;
        
        // Simple static website
        if (projectType === 'website' && complexity === 'simple') {
            return {
                name: 'HTML, CSS, and JavaScript',
                description: 'Perfect for beginners and simple websites. Easy to learn and deploy.'
            };
        }
        
        // Simple web app or medium website
        if ((projectType === 'webapp' && complexity === 'simple') || 
            (projectType === 'website' && complexity === 'medium')) {
            if (experience === 'beginner') {
                return {
                    name: 'HTML, CSS, JavaScript with Bootstrap',
                    description: 'Bootstrap provides ready-made components making development faster while staying beginner-friendly.'
                };
            } else {
                return {
                    name: 'React.js',
                    description: 'Popular, well-documented library with a strong ecosystem and community support.'
                };
            }
        }
        
        // Medium to complex web app
        if ((projectType === 'webapp' && (complexity === 'medium' || complexity === 'complex')) || 
            (projectType === 'website' && complexity === 'complex')) {
            if (experience === 'beginner') {
                return {
                    name: 'React.js with Create React App',
                    description: 'Simplified React setup that handles configuration for you.'
                };
            } else if (experience === 'some') {
                return {
                    name: 'React.js with Next.js',
                    description: 'Adds server-side rendering, routing, and optimizations with minimal configuration.'
                };
            } else {
                return {
                    name: 'React.js or Vue.js with TypeScript',
                    description: 'Adds type safety and better tooling for complex projects.'
                };
            }
        }
        
        // Mobile app
        if (projectType === 'mobile') {
            if (experience === 'beginner') {
                return {
                    name: 'React Native',
                    description: 'If you know React for web, transitioning to mobile is easier with React Native.'
                };
            } else {
                return {
                    name: 'React Native or Flutter',
                    description: 'Both allow cross-platform development with good performance.'
                };
            }
        }
        
        // Desktop app
        if (projectType === 'desktop') {
            return {
                name: 'Electron.js',
                description: 'Build desktop apps with web technologies like HTML, CSS, and JavaScript.'
            };
        }
        
        // Default option for anything else
        return {
            name: 'HTML, CSS, and JavaScript',
            description: 'The fundamentals that work for any web project.'
        };
    }
    
    function recommendBackend() {
        const { projectType, complexity, userData, realtime, experience } = userSelections;
        
        // Static website with no user data
        if (projectType === 'website' && complexity === 'simple' && userData === 'no') {
            return null;
        }
        
        // Projects that need user data
        if (userData === 'yes') {
            if (experience === 'beginner') {
                return {
                    name: 'Firebase',
                    description: 'Backend-as-a-service that requires minimal setup and coding.'
                };
            } else if (complexity === 'simple' || complexity === 'medium') {
                if (realtime === 'yes') {
                    return {
                        name: 'Node.js with Express and Socket.io',
                        description: 'Good for real-time applications like chat and live updates.'
                    };
                } else {
                    return {
                        name: 'Node.js with Express',
                        description: 'JavaScript on the backend lets you use the same language throughout your stack.'
                    };
                }
            } else {
                if (experience === 'experienced') {
                    return {
                        name: 'Node.js or Python with Django/Flask',
                        description: 'Powerful options for complex applications with extensive libraries.'
                    };
                } else {
                    return {
                        name: 'Node.js with Express',
                        description: 'Scales well for most applications with plenty of middleware options.'
                    };
                }
            }
        }
        
        // Mobile apps often need backends
        if (projectType === 'mobile') {
            return {
                name: 'Firebase or Node.js API',
                description: 'Firebase for simpler needs; custom API for more control.'
            };
        }
        
        // Desktop apps rarely need backends unless storing user data
        if (projectType === 'desktop' && userData === 'no') {
            return null;
        }
        
        return null;
    }
    
    function recommendDatabase() {
        const { userData, complexity, realtime, experience } = userSelections;
        
        // No database if no user data needed
        if (userData === 'no') {
            return null;
        }
        
        // Database recommendations based on project needs
        if (userData === 'yes') {
            if (experience === 'beginner') {
                return {
                    name: 'Firebase Firestore',
                    description: 'NoSQL database that works well with Firebase, easy to set up and use.'
                };
            }
            
            if (realtime === 'yes') {
                return {
                    name: 'MongoDB or Firebase Firestore',
                    description: 'NoSQL databases that handle real-time data well.'
                };
            }
            
            if (complexity === 'complex') {
                return {
                    name: 'PostgreSQL',
                    description: 'Powerful relational database for complex data relationships.'
                };
            }
            
            return {
                name: 'MongoDB',
                description: 'Flexible NoSQL database that works well with Node.js.'
            };
        }
        
        return null;
    }
});