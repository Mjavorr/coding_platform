FROM c-runner-base
COPY solution.c .
RUN gcc -o solution solution.c
CMD ["./solution"]