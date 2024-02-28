const clientIO = require('socket.io-client');

describe('Server Testing', () => {
    let socket;

    // Setup a socket connection before each test
    beforeEach((done) => {
        // Connect to the server
        socket = clientIO.connect('http://localhost:3000');

        // Handle connection
        socket.on('connect', () => {
            done();
        });

        // Handle errors
        socket.on('error', (error) => {
            done(error);
        });
    });

      // Disconnect the socket after each test
      afterEach((done) => {
        if (socket.connected) {
            socket.disconnect();
        }
        done();
    });


    // Test case to check if the server sends the count of connected clients
    test('should receive the count of connected clients from the server', (done) => {
        socket.on('count', (count) => {
            expect(count).toBeGreaterThanOrEqual(0); // Count should be non-negative
            done();
        });
    });

    test('Server broadcasts message to all connected clients', (done) => {
        const messageToSend = 'Broadcast this message to all clients';
    
        // Listen for new messages on all connected clients
        const clientsCount = 10; // Number of clients to connect
        let clientsDone = 0;
    
        const onMessageReceived = () => {
            clientsDone++;
            if (clientsDone === clientsCount) {
                done();
            }
        };
    
        for (let i = 0; i < clientsCount; i++) {
            const clientSocket = clientIO.connect('http://localhost:3000');
            clientSocket.on('connect', () => {
                clientSocket.emit('message', messageToSend);
                clientSocket.on('new_message', (receivedMessage) => {
                    // expect(receivedMessage).toBe(messageToSend);
                    onMessageReceived();
                });
            });
        }
    });



    test('Server handles heavy load gracefully', async () => {
        const messagesToSend = Array.from({ length: 1000 }, (_, i) => `Message ${i + 1}`);
    
        const promises = messagesToSend.map((message) => {
            return new Promise((resolve) => {
                socket.emit('message', message);
                socket.on('new_message', (receivedMessage) => {
                    // expect(receivedMessage).toBe(message);
                    resolve();
                });
            });
        });
    
        await Promise.all(promises);
    });


     // Test sending and receiving messages
  test('Send and receive messages', (done) => {
    const messageToSend = 'Testing message to send and receive';
    
    // Listen for new messages
    socket.on('new_message', (receivedMessage) => {
      // Check if the received message matches the sent message
      expect(receivedMessage).toBe(messageToSend);
      done(); // Signal that the test is complete
    });

    // Send a message
    socket.emit('message', messageToSend);
  });


    // Test broadcasting messages
    test('Broadcast messages', (done) => {
        const messageToSend = 'Hello, world! This is a Test Message to broadcast to all connected clients.';
    
        // Listen for new messages
        socket.on('new_message', (receivedMessage) => {
          // Check if the received message matches the sent message
          expect(receivedMessage).toBe(messageToSend);
          done(); // Signal that the test is complete
        });
    
        // Send a message
        socket.emit('message', messageToSend);
    

  
})
    
    });