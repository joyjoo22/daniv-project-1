// QR 스캐너 데모 — 시연용 가짜 카메라 뷰파인더.
//
// 실제 카메라 권한 / QR 디코딩 라이브러리 (zxing, jsQR 등) 없이 UX 만 구현.
// 모달 열림 → 2초 동안 "스캔 중" 시뮬레이션 → 자동 성공 → onScanned 콜백.
//
// 실제 운영 시: navigator.mediaDevices.getUserMedia + jsQR / @zxing/library 로 교체.
import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { QrIcon, CheckIcon } from './Icon';

type QrScannerModalProps = {
  open: boolean;
  onClose: () => void;
  /** 스캔 성공 시 호출 — 콜백 안에서 실제 적립 API 호출 */
  onScanned: () => void;
  /** 시연용 — 어느 가게/이벤트에서 스캔하는지 표시 */
  context?: string;
};

type Phase = 'scanning' | 'detected' | 'done';

const SCAN_MS = 2000;

export function QrScannerModal({ open, onClose, onScanned, context = '단풍식당' }: QrScannerModalProps) {
  const [phase, setPhase] = useState<Phase>('scanning');

  useEffect(() => {
    if (!open) {
      setPhase('scanning');
      return;
    }
    const t1 = setTimeout(() => setPhase('detected'), SCAN_MS);
    const t2 = setTimeout(() => {
      setPhase('done');
      onScanned();
    }, SCAN_MS + 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, onScanned]);

  return (
    <Modal open={open} onClose={onClose} title="QR 스캔" size="full">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          padding: '12px 0 8px',
        }}
      >
        {/* 컨텍스트 라벨 */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            background: 'var(--primary-soft)',
            color: 'var(--primary-ink)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          📍 {context} · 방문 QR
        </div>

        {/* 뷰파인더 */}
        <div
          style={{
            position: 'relative',
            width: 260,
            height: 260,
            borderRadius: 22,
            background: 'oklch(0.16 0.012 270)',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
          }}
        >
          {/* 가상 카메라 노이즈 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 30% 40%, oklch(0.24 0.02 270) 0%, transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.22 0.04 285) 0%, transparent 50%)',
              opacity: 0.6,
            }}
          />

          {/* 코너 브래킷 4개 */}
          {[
            { top: 16, left: 16, borderTop: '3px solid var(--accent)', borderLeft: '3px solid var(--accent)' },
            { top: 16, right: 16, borderTop: '3px solid var(--accent)', borderRight: '3px solid var(--accent)' },
            { bottom: 16, left: 16, borderBottom: '3px solid var(--accent)', borderLeft: '3px solid var(--accent)' },
            { bottom: 16, right: 16, borderBottom: '3px solid var(--accent)', borderRight: '3px solid var(--accent)' },
          ].map((corner, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 28,
                height: 28,
                borderRadius: 6,
                ...corner,
              }}
            />
          ))}

          {/* 가운데 결과 영역 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {phase === 'scanning' && (
              <>
                {/* 가짜 QR 그리드 (희미하게) */}
                <div
                  style={{
                    width: 140,
                    height: 140,
                    background:
                      'repeating-linear-gradient(0deg, rgba(255,255,255,.12) 0 8px, transparent 8px 16px), repeating-linear-gradient(90deg, rgba(255,255,255,.12) 0 8px, transparent 8px 16px)',
                    borderRadius: 4,
                    animation: 'daniv-splash-pulse 1.6s ease-in-out infinite',
                  }}
                />
                {/* 스캔 라인 */}
                <div
                  style={{
                    position: 'absolute',
                    left: 30,
                    right: 30,
                    height: 2,
                    background:
                      'linear-gradient(90deg, transparent, var(--accent), transparent)',
                    boxShadow: '0 0 12px var(--accent)',
                    animation: 'qr-scan 1.6s ease-in-out infinite',
                  }}
                />
              </>
            )}
            {phase === 'detected' && (
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: '#3a1d00',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'daniv-splash-circle 350ms cubic-bezier(.34,1.56,.64,1) both',
                }}
              >
                <CheckIcon size={44} />
              </div>
            )}
            {phase === 'done' && (
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  background: 'var(--mint)',
                  color: '#0a3022',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon size={44} />
              </div>
            )}
          </div>
        </div>

        {/* 상태 텍스트 */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}
          >
            {phase === 'scanning' && 'QR 코드를 인식 중...'}
            {phase === 'detected' && 'QR 코드 확인 완료'}
            {phase === 'done' && '스탬프 적립 완료 🎉'}
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--ink-4)' }}>
            {phase === 'scanning' && '뷰파인더 안에 코드를 비춰주세요'}
            {phase === 'detected' && '잠시만 기다려주세요'}
            {phase === 'done' && '+20p 가 적립되었어요'}
          </p>
        </div>

        {phase !== 'scanning' && (
          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: 4,
              padding: '12px 28px',
              borderRadius: 12,
              background: 'var(--ink)',
              color: 'var(--bg)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            닫기
          </button>
        )}
      </div>

      {/* 스캔 라인 키프레임 (인라인 정의) */}
      <style>{`
        @keyframes qr-scan {
          0% { top: 30px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 32px); opacity: 0; }
        }
      `}</style>
    </Modal>
  );
}

/** 시연용 — QR 아이콘 시각만 보이는 인디고 박스 */
export function QrIconBadge({ size = 28 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: 'var(--primary-soft)',
        color: 'var(--primary-ink)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <QrIcon size={size * 0.6} />
    </span>
  );
}
