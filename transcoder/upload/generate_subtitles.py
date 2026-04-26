# output/generate_subtitles.py

import whisper
import sys
import os

def transcrever(video_path, output_dir):
    print(f"📝 Transcrevendo: {video_path}")
    model = whisper.load_model("base")
    result = model.transcribe(video_path, fp16=False)

    os.makedirs(output_dir, exist_ok=True)

    vtt_path = os.path.join(output_dir, "english.vtt")
    with open(vtt_path, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for seg in result["segments"]:
            def format_time(t):
                h = int(t // 3600)
                m = int((t % 3600) // 60)
                s = t % 60
                return f"{h:02}:{m:02}:{s:06.3f}"  # <- com ponto, não vírgula

            f.write(f"{format_time(seg['start'])} --> {format_time(seg['end'])}\n")
            f.write(f"{seg['text'].strip()}\n\n")

    print(f"✅ Legenda salva em: {vtt_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("❌ Uso: python generate_subtitles.py <video_path> <output_dir>")
        sys.exit(1)

    video_path = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(video_path):
        print(f"❌ Vídeo não encontrado: {video_path}")
        sys.exit(1)

    transcrever(video_path, output_dir)
