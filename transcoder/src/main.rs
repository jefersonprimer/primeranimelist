use std::fs::{self, File};
use std::io::Write;
use std::path::Path; // PathBuf ainda é um warning, mas não causa erro. Pode remover se quiser.
use std::process::Command;

use chrono::Utc;
use serde_json::json;
use walkdir::WalkDir;

const UPLOAD_DIR: &str = "upload";
const OUTPUT_DIR: &str = "output";

fn main() {
    fs::create_dir_all(OUTPUT_DIR).expect("❌ Falha ao criar a pasta de saída");

    println!("⏳ Procurando vídeos em '{UPLOAD_DIR}'...");
    for entry in WalkDir::new(UPLOAD_DIR)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.path().extension().map(|ext| ext == "mp4").unwrap_or(false))
    {
        let path = entry.path();
        let filename = path.file_stem().unwrap().to_string_lossy();

        println!("\n🎞️  Processando: {filename}.mp4");

        let output_folder = Path::new(OUTPUT_DIR).join(&*filename);
        fs::create_dir_all(&output_folder).expect("❌ Falha ao criar pasta do vídeo");

        let sprite_path = output_folder.join("thumbnails.jpg");
        let vtt_path = output_folder.join("thumbnails.vtt");

        // 🕒 Pegar duração do vídeo com ffprobe
        let Some(duration) = get_video_duration(path) else {
            eprintln!("❌ Não foi possível obter duração do vídeo: {filename}");
            continue;
        };

        let interval = 5; // Intervalo de 5 segundos para cada miniatura
        // O número de miniaturas será a duração / intervalo, arredondado para cima se necessário
        let total_thumbs = (duration as f64 / interval as f64).ceil() as u64;

        let thumbs_per_row = 5;
        let thumb_width = 160;
        let thumb_height = 90;
        // Calcula o número de linhas baseado no total de miniaturas e miniaturas por linha
        let rows = (total_thumbs + thumbs_per_row - 1) / thumbs_per_row;

        // 🎬 Gerar sprite com FFmpeg
        let tile_arg = format!("{}x{}", thumbs_per_row, rows);
        let status = Command::new("ffmpeg")
        .args([
            "-i",
            path.to_str().unwrap(),
            "-vf",
            &format!("thumbnail,scale={}:{},tile={}", thumb_width, thumb_height, tile_arg),
            "-vframes", // Adicione esta linha
            "1",         // Adicione esta linha
            sprite_path.to_str().unwrap(),
            "-y",
        ])
        .status()
        .expect("❌ Erro ao rodar ffmpeg");


        if !status.success() {
            eprintln!("❌ FFmpeg falhou em {filename}");
            continue;
        }

        // 📄 Gerar arquivo VTT
        let mut vtt = String::from("WEBVTT\n\n");
        let mut x = 0;
        let mut y = 0;

        for i in 0..total_thumbs {
            let start = i * interval;
            let end = (i + 1) * interval;

            vtt += &format!(
                "{} --> {}\n",
                format_time(start),
                format_time(end)
            );
            vtt += &format!(
                "thumbnails.jpg#xywh={},{},{},{}\n\n",
                x, y, thumb_width, thumb_height
            );

            x += thumb_width;
            if (i + 1) % thumbs_per_row == 0 {
                x = 0;
                y += thumb_height;
            }
        }

        let mut file = File::create(&vtt_path).expect("❌ Erro ao criar VTT");
        file.write_all(vtt.as_bytes()).unwrap();

        // ✅ Saída final
        let result = json!({
            "video": path.to_str().unwrap(),
            "sprite": sprite_path.to_str().unwrap(),
            "vtt": vtt_path.to_str().unwrap(),
            "thumbs": total_thumbs,
            "interval": interval,
            "thumb_size": { "width": thumb_width, "height": thumb_height },
            "grid": { "cols": thumbs_per_row, "rows": rows },
            "processed_at": Utc::now().to_rfc3339(),
        });

        println!("✅ Finalizado para {filename}:\n{}", result);

    }
}

/// 🕒 Pega duração do vídeo com ffprobe (em segundos)
fn get_video_duration(path: &Path) -> Option<u64> {
    let output = Command::new("ffprobe")
        .args([
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path.to_str().unwrap(),
        ])
        .output()
        .ok()?;

    let duration_str = String::from_utf8_lossy(&output.stdout);
    // Tenta parsear para f64 e depois arredonda para o inteiro mais próximo antes de converter para u64
    duration_str.trim().parse::<f64>().ok().map(|d| d.round() as u64)
}

/// 🧠 Formata segundos para hh:mm:ss.000
fn format_time(seconds: u64) -> String {
    let h = seconds / 3600;
    let m = (seconds % 3600) / 60;
    let s = seconds % 60;
    format!("{:02}:{:02}:{:02}.000", h, m, s)
}

