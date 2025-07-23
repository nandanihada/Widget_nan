const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dynamic_widget_system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  projects: [String]
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  projectId: String,
  name: String,
  description: String,
  userId: String,
  questions: [{
    id: String,
    text: String,
    type: String,
    options: [String],
    required: Boolean,
    order: Number
  }],
  settings: {
    theme: {
      primaryColor: { type: String, default: '#007bff' },
      secondaryColor: { type: String, default: '#6c757d' },
      backgroundColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#333333' },
      borderRadius: { type: String, default: '8px' }
    },
    branding: {
      showPoweredBy: { type: Boolean, default: true },
      customLogo: String
    },
    behavior: {
      autoSubmit: { type: Boolean, default: false },
      showProgressBar: { type: Boolean, default: true },
      allowBack: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

async function setupTestData() {
  try {
    // Clear existing test data
    await Project.deleteOne({ projectId: 'test-project-123' });
    
    // Create test project
    const testProject = new Project({
      projectId: 'test-project-123',
      name: 'Demo Survey',
      description: 'A demo survey for testing the widget',
      userId: 'test-user-id',
      questions: [
        {
          id: 'q1',
          text: 'How would you rate our service?',
          type: 'rating',
          required: true,
          order: 1
        },
        {
          id: 'q2',
          text: 'Which features do you use most?',
          type: 'multiple-choice',
          options: ['Feature A', 'Feature B', 'Feature C', 'Other'],
          required: true,
          order: 2
        },
        {
          id: 'q3',
          text: 'Would you recommend us to others?',
          type: 'boolean',
          required: true,
          order: 3
        },
        {
          id: 'q4',
          text: 'Any additional feedback?',
          type: 'text',
          required: false,
          order: 4
        }
      ],
      settings: {
        theme: {
          primaryColor: '#007bff',
          secondaryColor: '#6c757d',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          borderRadius: '8px'
        },
        branding: {
          showPoweredBy: true
        },
        behavior: {
          autoSubmit: false,
          showProgressBar: true,
          allowBack: true
        }
      }
    });

    await testProject.save();
    console.log('✅ Test project created successfully!');
    console.log('Project ID: test-project-123');
    console.log('Questions:', testProject.questions.length);
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

setupTestData();
