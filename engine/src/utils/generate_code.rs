use rand::Rng;

pub fn gen() -> i32 {
    rand::thread_rng().gen_range(100000..999999)
}
