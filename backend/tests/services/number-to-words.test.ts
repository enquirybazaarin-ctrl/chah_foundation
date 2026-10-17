import { amountInWordsIndian } from '../../src/utils/number-to-words';

describe('amountInWordsIndian', () => {
  it('converts single rupee', () => {
    expect(amountInWordsIndian(1)).toBe('One Rupee Only');
  });

  it('converts small amounts', () => {
    expect(amountInWordsIndian(5)).toBe('Five Rupees Only');
    expect(amountInWordsIndian(20)).toBe('Twenty Rupees Only');
    expect(amountInWordsIndian(99)).toBe('Ninety-Nine Rupees Only');
  });

  it('converts hundreds and thousands', () => {
    expect(amountInWordsIndian(500)).toBe('Five Hundred Rupees Only');
    expect(amountInWordsIndian(1000)).toBe('One Thousand Rupees Only');
    expect(amountInWordsIndian(17261)).toBe('Seventeen Thousand Two Hundred Sixty-One Rupees Only');
  });

  it('converts lakhs and crores', () => {
    expect(amountInWordsIndian(100000)).toBe('One Lakh Rupees Only');
    expect(amountInWordsIndian(2500000)).toBe('Twenty-Five Lakh Rupees Only');
    expect(amountInWordsIndian(10000000)).toBe('One Crore Rupees Only');
  });

  it('handles paise', () => {
    expect(amountInWordsIndian(1.50)).toBe('One Rupee and Fifty Paise Only');
    expect(amountInWordsIndian(500.25)).toBe('Five Hundred Rupees and Twenty-Five Paise Only');
  });

  it('handles 0 or invalid gracefully', () => {
    expect(amountInWordsIndian(0)).toBe('Zero Rupees Only');
    expect(amountInWordsIndian(-10)).toBe('Zero Rupees Only');
  });
});
