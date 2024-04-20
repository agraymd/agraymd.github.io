# ALEXANDER J. GRAY RESUME PROJECT 
## Creating a resume with HTML / CSS / JAVASCRIPT 

I wanted to create a static website / resume so this is the beginning of that and will evolve or change over time. 

To view my current resume, visit here:

[https://agraymd.github.io/alexanderGrayResume042024.html](https://agraymd.github.io/alexanderGrayResume042024.html)

Enjoy :)


## POST a message to the ec2 Instance 

There is an ec2 instance running (free tier) that has a C socket listening for POST messages to port 8080. 

This is how the contact functionality of [the resume page](https://agraymd.github.io/alexanderGrayResume042024.html) works. 

### CODE: 

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8080
#define MAX_MESSAGE_SIZE 1024

int main() {
    int sockfd, newsockfd;
    socklen_t clilen;
    char buffer[MAX_MESSAGE_SIZE];
    struct sockaddr_in serv_addr, cli_addr;
    int n;

    // Create socket
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("ERROR opening socket");
        exit(1);
    }

    // Initialize socket structure
    memset((char *) &serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(PORT);

    // Bind the host address
    if (bind(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0) {
        perror("ERROR on binding");
        exit(1);
    }

    // Listen for incoming connections
    listen(sockfd, 5);
    clilen = sizeof(cli_addr);

    while (1) {
        // Accept incoming connections
        newsockfd = accept(sockfd, (struct sockaddr *) &cli_addr, &clilen);
        if (newsockfd < 0) {
            perror("ERROR on accept");
            exit(1);
        }

        // Read POST data from client
        memset(buffer, 0, MAX_MESSAGE_SIZE);
        n = read(newsockfd, buffer, MAX_MESSAGE_SIZE - 1);
        if (n < 0) {
            perror("ERROR reading from socket");
            exit(1);
        }

        // Save received message to log file
        FILE *fp;
        fp = fopen("logfile.txt", "a");
        if (fp == NULL) {
            perror("ERROR opening file");
            exit(1);
        }
        fprintf(fp, "%s\n", buffer);
        fclose(fp);

        // Send response to client
        n = write(newsockfd, "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html><body><h1>Message received</h1></body></html>\n", strlen("HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html><body><h1>Message received</h1></body></html>\n"));
        if (n < 0) {
            perror("ERROR writing to socket");
            exit(1);
        }

        close(newsockfd);
    }

    close(sockfd);
    return 0;
}
```

**Be responsible please :\)**