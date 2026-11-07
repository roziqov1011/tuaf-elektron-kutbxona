import { Language, LibraryResource, StudentProfile } from '../types/library';

function sanitizePdfText(input: string): string {
  return input
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[—–]/g, '-')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/([()\\])/g, '\\$1');
}

function wrapLines(text: string, maxChars = 78): string[] {
  const words = sanitizePdfText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates a valid %PDF-1.4 document with Turon University Andijon Filiali
 * institutional metadata, student HEMIS license stamp, abstract, and chapter text,
 * and triggers a browser file download without window.open/alert.
 */
export function downloadResourcePdf(
  resource: LibraryResource,
  student: StudentProfile,
  lang: Language
): string {
  const titleText = resource.title[lang] || resource.title.uz || resource.title.en;
  const abstractText =
    resource.abstract[lang] || resource.abstract.uz || resource.abstract.en;
  const chapterTitle =
    resource.chapters?.[0]?.title[lang] ||
    resource.chapters?.[0]?.title.uz ||
    'I Bob. Asosiy qism';
  const chapterBody =
    resource.chapters?.[0]?.content[lang] ||
    resource.chapters?.[0]?.content.uz ||
    abstractText;

  const contentLines: string[] = [
    'TURON UNIVERSITY - ANDIJON FILIALI (TUAF.UZ)',
    'AXBOROT-RESURS MARKAZI | ELEKTRON KUTUBXONA REPOZITORIYASI',
    '------------------------------------------------------------------------',
    `Kitob / Nashr: ${sanitizePdfText(titleText)}`,
    `Muallif(lar): ${sanitizePdfText(resource.authors.join(', '))}`,
    `Nashr yili: ${resource.year}  |  Betlar: ${resource.pages}  |  Til: ${sanitizePdfText(resource.language)}`,
    `DOI: ${sanitizePdfText(resource.doi)}  |  Shifr / UDK: ${sanitizePdfText(resource.udc)}`,
    `Nashriyot: ${sanitizePdfText(resource.publisher)}`,
    '------------------------------------------------------------------------',
    `TALABA LITSENZIYASI (FAQAT RO'YXATDAN O'TGAN TALABALAR UCHUN):`,
    `Talaba F.I.Sh.: ${sanitizePdfText(student.fullName)}`,
    `HEMIS ID: ${sanitizePdfText(student.hemisId)}  |  Yo'nalish: ${sanitizePdfText(student.programCode)}`,
    `Yuklab olingan sana: ${new Date().toISOString().slice(0, 10)}`,
    '------------------------------------------------------------------------',
    'ANNOTATSIYA / ABSTRACT:',
    ...wrapLines(abstractText, 76),
    ' ',
    '------------------------------------------------------------------------',
    sanitizePdfText(chapterTitle),
    ...wrapLines(chapterBody, 76),
    ' ',
    '------------------------------------------------------------------------',
    'Manzil: Andijon shahar, Paxtakor MFY, A.Yuldashev ko\'chasi, 58-a-uy',
    'Rasmiy veb-sayt: https://tuaf.uz  |  HEMIS: https://hemis.tuaf.uz',
  ];

  const streamCommands: string[] = ['BT', '/F1 10 Tf', '50 780 Td', '14 TL'];
  contentLines.slice(0, 48).forEach((line, index) => {
    if (index === 0) {
      streamCommands.push(`(${line}) Tj`);
    } else {
      streamCommands.push(`T* (${line}) Tj`);
    }
  });
  streamCommands.push('ET');

  const streamData = streamCommands.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    `5 0 obj\n<< /Length ${streamData.length} >>\nstream\n${streamData}\nendstream\nendobj`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + '\n';
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const safeFileName =
    sanitizePdfText(titleText)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 45) || `tuaf-book-${resource.id}`;

  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeFileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);

  return `${safeFileName}.pdf`;
}
