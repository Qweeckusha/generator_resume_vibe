import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Page } from '../App';

interface Props {
  navigate: (p: Page) => void;
}

export default function Payment({ navigate }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate('loading');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="max-w-lg w-full">
        <button
          onClick={() => navigate('survey')}
          className="text-gray-400 hover:text-white transition-colors text-sm mb-4"
        >
          ← Назад к анкете
        </button>

        <motion.div
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-2">
            Оплата <span className="gradient-text">заказа</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6">Тариф «Про» — создание резюме с помощью AI</p>

          {/* Order summary */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Резюме «Про»</div>
                <div className="text-xs text-gray-400">3 шаблона • PDF • Сопроводительное письмо</div>
              </div>
              <div className="text-2xl font-bold gradient-text">599 ₽</div>
            </div>
          </div>

          {/* Card form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Номер карты</label>
              <input
                className="input-field font-mono"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCard(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Срок</label>
                <input
                  className="input-field font-mono"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CVV</label>
                <input
                  className="input-field font-mono"
                  placeholder="000"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Имя владельца</label>
              <input
                className="input-field"
                placeholder="IVAN IVANOV"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <motion.button
            className="btn-primary w-full mt-6 text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={pay}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Обработка...
              </span>
            ) : (
              'Оплатить 599 ₽'
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <span>🔒</span> Безопасная оплата • Данные защищены
          </div>
        </motion.div>
      </div>
    </div>
  );
}
