# CYBPRO: Open Models and Media Strategy

## Important reality about “free and unlimited”
No hosted model API should be assumed free and unlimited. Hosted services can impose quotas, concurrency caps, fair-use restrictions, or change terms. Self-hosted inference can avoid per-token API bills but is limited by hardware, memory, electricity, bandwidth, throughput, and model licences. Plan for bounded usage and graceful degradation.

## Candidate model approach
- Start with deterministic rules and public threat intelligence for security signals.
- Evaluate a local multimodal model such as Qwen2.5-Omni for text, image, audio, and video research. Verify the exact checkpoint's licence, supported hardware, current compatibility, and performance before selecting it for production.
- Use smaller task-specific components where they are cheaper and more reliable: OCR for images/PDF pages, speech recognition for audio, and frame sampling for video.
- Use a provider interface so the app can switch between local models and any approved optional API without rewriting product logic.
- Do not send user submissions to external providers without a clear disclosure and appropriate consent.
- Do not let the model independently mark a URL as malicious. Combine model explanations with deterministic signals and source evidence.
- Validate model output against a schema; handle timeout, empty response, invalid JSON, prompt injection, and provider failure.

## Supported upload policy
“Accept all file types” is unsafe and not technically meaningful. The product should accept a defined allowlist, validate actual file signatures (not only filename extensions), and reject executables, unsupported formats, archives that cannot be safely inspected, encrypted files, corrupt inputs, and files above configured limits.

Planned categories:
- Text: TXT, CSV, JSON, EML and selected message exports.
- Documents: PDF, DOCX; additional office formats only after safe parsers and tests exist.
- Images: JPEG, PNG, WEBP.
- Audio: WAV, MP3, M4A/FLAC where the selected pipeline supports them.
- Video: MP4/WebM with strict duration, size, and frame-sampling limits.
- URLs: parsed as data only; never automatically browse the destination during ordinary analysis.

Files must be treated as untrusted. Use isolated parsers, resource limits, temporary storage cleanup, malware scanning where available, and privacy-preserving logs. Do not execute uploaded content. Strip metadata where appropriate and explain when only a subset of a video or audio file was analyzed.

## Evaluation before model selection
Evaluate on the same held-out dataset and task definitions. Track precision, recall, F1, false-positive rate, latency, memory use, failure rate, language coverage, and cost per analysis where applicable. Keep a model card with exact version, quantization, licence, hardware, and known limitations.

## Quantum research
Qiskit is an experimental research component. Begin with a small, reproducible classification experiment and compare it against classical models. It is not part of the critical path and must not be claimed to improve protection unless experiments show that.
