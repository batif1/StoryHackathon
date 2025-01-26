#Code from https://www.clipsai.com/

import clipsai
import nltk
import ffmpeg

FILE_PATH = './video.mp4'
nltk.download('punkt_tab')
transcriber = clipsai.Transcriber()
transcription = transcriber.transcribe(audio_file_path=FILE_PATH)

clipfinder = clipsai.ClipFinder()
clips = clipfinder.find_clips(transcription=transcription)

clip_starts = [i.start_time for i in clips]
clip_ends = [i.end_time for i in clips]

print(clip_starts)
print(clip_ends)


media_editor = clipsai.MediaEditor()

# use this if the file contains audio stream only
media_file = clipsai.AudioFile(FILE_PATH)
# use this if the file contains both audio and video stream
media_file = clipsai.AudioVideoFile(FILE_PATH)

clip = clips[0]  # select the clip you'd like to trim

maxIndex = 0
for index, clip in enumerate(clips):
    clip_media_file = media_editor.trim(
        media_file=media_file,
        start_time=clip.start_time,
        end_time=clip.end_time,
        trimmed_media_file_path="./clip" + str(index) + ".mp4",  # doesn't exist yet
    )
    maxIndex = index