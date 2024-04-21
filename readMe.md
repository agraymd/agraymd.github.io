# ALEXANDER J. GRAY RESUME PROJECT 
## Creating a resume with HTML / CSS / JAVASCRIPT 

I wanted to create a static website / resume so this is the beginning of that and will evolve or change over time. 

To view my current resume, visit here:

[https://agraymd.github.io/alexanderGrayResume042024.html](https://agraymd.github.io/alexanderGrayResume042024.html)

Enjoy :)


## POST a message to the ec2 Instance 

There is an ec2 instance running (free tier) that has a C socket listening for POST messages to port 8080. 

This is how the contact functionality of [the resume page](https://agraymd.github.io/alexanderGrayResume042024.html) works. 

I don't actually expect serious messages here, I just had the idea as a project and wanted to see how far I could take it.

### C SOCKET HTTP SERVER CODE: 

- Updated 21-APRIL-2024 to continue reading requests until the entire body is read or client terminates.

- I noticed an issue where requests sent from Safari did not have the entire request body, but only some of the request headers.

- I took captures on the server and client, and noticed that Safari clients were sending the whole request, but it was incomplete on the server side. I also used Developer tools in the browser to validate.

- This indicated that the code was closing the socket before reading the entire message, so I used GPT to fix the C socket code.

- After implementing changes and testing, the entire message is received from Safari clients. 

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8080
#define MAX_MESSAGE_SIZE 4096 // Increased buffer size

void handle_request(int sockfd) {
    char buffer[MAX_MESSAGE_SIZE];
    int n;

    // Read request headers (may include Content-Length)
    memset(buffer, 0, MAX_MESSAGE_SIZE);
    n = read(sockfd, buffer, MAX_MESSAGE_SIZE - 1);
    if (n < 0) {
        perror("ERROR reading from socket");
        exit(1);
    }

    // Read the entire request body if Content-Length is present
    char *content_length_ptr = strstr(buffer, "Content-Length:");
    if (content_length_ptr != NULL) {
        int content_length;
        sscanf(content_length_ptr + strlen("Content-Length:"), "%d", &content_length);
        int bytes_read = strlen(buffer);
        while (bytes_read < content_length) {
            n = read(sockfd, buffer + bytes_read, content_length - bytes_read);
            if (n < 0) {
                perror("ERROR reading from socket");
                exit(1);
            }
            bytes_read += n;
        }
    }

    // Print request to console
    printf("Received request:\n%s\n", buffer);

    // Save received message to log file
    FILE *fp;
    fp = fopen("logfile.txt", "a");
    if (fp == NULL) {
        perror("ERROR opening file");
        exit(1);
    }
    fprintf(fp, "%s\n", buffer);
    fclose(fp);
}

int main() {
    int sockfd, newsockfd;
    socklen_t clilen;
    struct sockaddr_in serv_addr, cli_addr;

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

        // Handle request
        handle_request(newsockfd);

        // Send response to client
        const char *response = "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html><body><h1>Message received</h1></body></html>\n";
        write(newsockfd, response, strlen(response));

        // Close connection
        close(newsockfd);
    }

    close(sockfd);
    return 0;
}
```
**Be responsible please :\)**

#### Server Logs

```
POST / HTTP/1.1
Host: 54.237.227.50:8080
Content-Type: application/x-www-form-urlencoded
Origin: https://agraymd.github.io
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1
Content-Length: 1943
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate

fname=iPhone+&message=Safari+&g-recaptcha-response=<snip>
POST / HTTP/1.1
Host: 54.237.227.50:8080
Content-Type: application/x-www-form-urlencoded
Origin: https://agraymd.github.io
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1
Content-Length: 1979
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate

fname=Alexander&message=Fixing+phone+safari+&g-recaptcha-response=<snip>


POST / HTTP/1.1
Host: 54.237.227.50:8080
Content-Type: application/x-www-form-urlencoded
Origin: https://agraymd.github.io
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15
Content-Length: 1935
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate

fname=Browser+Safari&message=On+the+MacBook&g-recaptcha-response=<snip>
[ec2-user@ip-172-31-24-255 ~]$ 
```

- I added Google recaptcha to the form to prevent some abuse, and don't expect much traffic anyway. 
- This is just a fun project for me to experiment with C programming, AWS, AI, web development, and security. 
- This could be improved with further sercurity, more comprehensive messaging / response, load balancing for scaling, etc. 

Thank you for checking out my page, and have a great day :D 