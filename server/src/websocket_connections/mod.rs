use std::sync::{Mutex, Arc, MutexGuard};

pub mod connection;
pub mod websocket_listener;

pub trait ForceLock {
    type Inner;

    /// Ignore poison errors and keep running.
    /// Be careful where you use this!! 
    /// Sometimes an error means the server should shut down, not carry on.
    fn force_lock(self) -> Self::Inner;
}

impl<'a, T> ForceLock for &'a Arc<Mutex<T>> {
    type Inner = MutexGuard<'a, T>;

    fn force_lock(self) -> Self::Inner {
        match self.lock() {
            Ok(lobbies) => lobbies,
            Err(err) => {
                // TODO: un-poison mutex https://github.com/rust-lang/rust/issues/96469
                err.into_inner()
            }
        }
    }
}
