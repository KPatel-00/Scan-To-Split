import { Participant, Item, Currency, Receipt } from '../../store/useStore';
import { APP_NAME, APP_WEBSITE } from '@/lib/constants/app';

interface ShareableImageCardProps {
  participants: Participant[];
  items: Item[];
  receipts: Receipt[];
  currency: Currency;
  storeName?: string;
  managementMode: 'merged' | 'separate';
  mergedTax?: number;
  mergedTip?: number;
}

export function ShareableImageCard({
  participants,
  items,
  receipts,
  currency,
  storeName,
  managementMode,
  mergedTax = 0,
  mergedTip = 0,
}: ShareableImageCardProps) {
  // Calculate participant costs (with tax/tip proportional distribution)
  const participantCosts = participants.map((participant) => {
    let itemCost = 0;
    
    // Calculate base item cost
    const allItems = managementMode === 'merged' ? items : receipts.flatMap(r => r.items);
    allItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      if (item.assignments && item.assignments[participant.id]) {
        // Custom split
        itemCost += item.assignments[participant.id];
      } else if (item.assignedTo?.includes(participant.id)) {
        // Equal split
        const assignedCount = item.assignedTo.length;
        itemCost += itemTotal / assignedCount;
      }
    });

    // Calculate proportional share of tax/tip
    const totalItemCost = allItems.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const hasAssignments = item.assignedTo && item.assignedTo.length > 0;
      return hasAssignments ? sum + itemTotal : sum;
    }, 0);

    const costPercentage = totalItemCost > 0 ? itemCost / totalItemCost : 0;
    
    let tax = 0;
    let tip = 0;
    if (managementMode === 'merged') {
      tax = mergedTax;
      tip = mergedTip;
    } else {
      receipts.forEach(receipt => {
        tax += receipt.tax || 0;
        tip += receipt.tip || 0;
      });
    }
    
    const shareOfModifiers = costPercentage * (tax + tip);
    const totalCost = itemCost + shareOfModifiers;

    return { participant, total: totalCost, percentage: 0 };
  });

  // Calculate grand total
  const subtotal = (managementMode === 'merged' ? items : receipts.flatMap(r => r.items))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let totalTax = 0;
  let totalTip = 0;
  if (managementMode === 'merged') {
    totalTax = mergedTax;
    totalTip = mergedTip;
  } else {
    receipts.forEach(receipt => {
      totalTax += receipt.tax || 0;
      totalTip += receipt.tip || 0;
    });
  }
  
  const grandTotal = subtotal + totalTax + totalTip;

  // Calculate percentages
  participantCosts.forEach(pc => {
    pc.percentage = grandTotal > 0 ? (pc.total / grandTotal) * 100 : 0;
  });

  // Build sources string
  let sources = '';
  if (managementMode === 'merged') {
    sources = storeName || 'Unknown Store';
  } else {
    const storeNames = receipts
      .map(r => r.storeName || 'Unknown')
      .filter((name, index, self) => self.indexOf(name) === index)
      .join(' & ');
    sources = storeNames;
  }

  return (
    <div
      id="shareable-image-card"
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#ffffff',
        // Off-screen positioning
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
      }}
    >
      {/* Decorative Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '48px 64px', // 8pt grid: 48px (6×8), 64px (8×8)
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '40px' }}> {/* 8pt grid: 40px (5×8) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px', // 8pt grid: 16px (2×8)
              marginBottom: '16px', // 8pt grid: 16px (2×8)
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: '48px', // 8pt grid: 48px (6×8)
                height: '48px',
                borderRadius: '12px', // 8pt grid: 12px (1.5×8, acceptable for border-radius)
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)', // 8pt grid: 8px, 24px
              }}
            >
              📸
            </div>
            
            {/* App Name */}
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {APP_NAME}
            </div>
          </div>

          {/* Grand Total */}
          <div style={{ marginBottom: '8px' }}> {/* 8pt grid: 8px (1×8) */}
            <div style={{ fontSize: '18px', opacity: 0.7, marginBottom: '8px' }}> {/* 8pt grid: 8px */}
              Total
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {currency.symbol}{grandTotal.toFixed(2)}
            </div>
          </div>

          {/* Sources */}
          <div
            style={{
              fontSize: '20px',
              opacity: 0.8,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ opacity: 0.6 }}>From:</span>
            <span style={{ fontWeight: '500' }}>{sources}</span>
          </div>
        </div>

        {/* Participants Grid */}
        <div
          style={{
            display: 'grid',
              gridTemplateColumns:
              participantCosts.length === 1
                ? '1fr'
                : participantCosts.length === 2
                ? '1fr 1fr'
                : participantCosts.length <= 4
                ? '1fr 1fr'
                : '1fr 1fr 1fr',
            gap: '16px', // 8pt grid: 16px (2×8)
            flex: 1,
            alignContent: 'start',
          }}
        >
          {participantCosts.slice(0, 6).map(({ participant, total, percentage }) => (
            <div
              key={participant.id}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px', // 8pt grid: 16px (2×8)
                padding: '24px', // 8pt grid: 24px (3×8) - increased from 20px for better spacing
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px', // 8pt grid: 16px (2×8)
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', // 8pt grid: 4px, 16px
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '56px', // 8pt grid: 56px (7×8)
                  height: '56px',
                  minWidth: '56px',
                  borderRadius: '50%',
                  backgroundColor: participant.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  boxShadow: `0 4px 12px ${participant.color}40`,
                }}
              >
                {participant.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name */}
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px', // 8pt grid: 8px (1×8) - increased from 4px
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {participant.name}
                </div>

                {/* Amount & Percentage */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px', // 8pt grid: 8px (1×8)
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: '700' }}>
                    {currency.symbol}{total.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '16px', opacity: 0.6 }}>
                    ({percentage.toFixed(0)}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '24px', // 8pt grid: 24px (3×8)
            paddingTop: '24px', // 8pt grid: 24px (3×8) - increased from 20px
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '16px', opacity: 0.6 }}>
            {items.length + receipts.reduce((sum, r) => sum + (r.items?.length || 0), 0)} items • {participants.length} people
          </div>
          <div
            style={{
              fontSize: '16px',
              opacity: 0.5,
              fontStyle: 'italic',
            }}
          >
            {APP_WEBSITE.replace('https://', '')}
          </div>
        </div>
      </div>
    </div>
  );
}
