FROM rust

RUN cargo install cargo-watch

WORKDIR /usr/app
COPY . .

RUN cargo build --release

CMD [ "cargo", "run", "--release" ]