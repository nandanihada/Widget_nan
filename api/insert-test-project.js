// Connect to MongoDB and insert test project
const { MongoClient } = require('mongodb');

async function insertTestProject() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dynamic_widget_system');
    const projects = db.collection('projects');
    
    // Remove existing test project
    await projects.deleteOne({ projectId: 'test-project-123' });
    
    // Insert new test project
    const testProject = {
      projectId: 'test-project-123',
      name: 'Demo Survey',
      description: 'A demo survey for testing the widget',
      userId: '6880a0b87e45aef60d4b4d36', // Use the user ID from registration
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
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await projects.insertOne(testProject);
    console.log('✅ Test project inserted successfully!');
    console.log('Project ID:', testProject.projectId);
    console.log('MongoDB _id:', result.insertedId);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

insertTestProject();
