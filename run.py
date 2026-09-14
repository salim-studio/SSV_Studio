"""Run SSV Studio."""
import uvicorn
if __name__ == "__main__":
    print("🎙️  SSV Studio running at: http://127.0.0.1:3900")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=3900, reload=True)
