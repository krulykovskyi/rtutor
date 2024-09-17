use serde::{Deserialize, Serialize};

pub type LessonsList = Vec<LessonsListItem>;

#[derive(Serialize, Deserialize)]
pub struct LessonsListItem {
    pub id: String,
    pub title: String,
    pub completed: bool,
}

pub const BASIC_RUST_LESSONS: [&str; 20] = [
    "Basic syntax and program structure",
    "Variables, data types, and constants",
    "Functions and control flow",
    "Ownership, borrowing, and lifetimes",
    "Structs, enums, and tuples",
    "Pattern matching and if let statements",
    "Vectors, strings, and hash maps",
    "Error handling: Option and Result",
    "Traits and generic programming",
    "Testing and documenting code",
    "Closures and iterators",
    "Smart pointers: Box, Rc, and RefCell",
    "Concurrency and parallelism",
    "Asynchronous programming with async/await",
    "Macros and metaprogramming",
    "Unsafe Rust and FFI (Foreign Function Interface)",
    "Working with the file system and I/O",
    "Data serialization and deserialization",
    "Network programming",
    "Web application development in Rust",
];
