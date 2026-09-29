import test from 'node:test';
import assert from 'node:assert/strict';
import { isAfterHours, withAfterHoursRecipient, AFTER_HOURS_RECIPIENT } from '../src/lib/after-hours.ts';
const cases = [
 ['summer before opening','2026-09-29T13:59:59Z',true],
 ['summer opening','2026-09-29T14:00:00Z',false],
 ['summer before closing','2026-09-29T22:59:59Z',false],
 ['summer closing','2026-09-29T23:00:00Z',true],
 ['winter before opening','2026-12-01T14:59:59Z',true],
 ['winter opening','2026-12-01T15:00:00Z',false],
 ['winter closing','2026-12-02T00:00:00Z',true],
 ['Saturday','2026-09-26T18:00:00Z',true],
 ['Sunday','2026-09-27T18:00:00Z',true],
 ['Mountain previous day','2026-09-29T01:00:00Z',true],
 ['observed Independence Day','2026-07-03T18:00:00Z',true],
 ['observed Christmas Sunday','2022-12-26T19:00:00Z',true],
 ['next year New Year observance','2027-12-31T19:00:00Z',true],
 ['spring daylight saving weekday','2026-03-09T14:00:00Z',false],
 ['fall daylight saving weekday','2026-11-02T15:00:00Z',false],
];
for (const [label, instant, expected] of cases) test(label, () => assert.equal(isAfterHours(new Date(instant)),expected));
for(const day of ['2026-01-01','2026-01-19','2026-02-16','2026-05-25','2026-06-19','2026-07-03','2026-09-07','2026-10-12','2026-11-11','2026-11-26','2026-12-25']) {
 test(`2026 holiday ${day}`,()=>assert.equal(isAfterHours(new Date(`${day}T19:00:00Z`)),true));
}
test('preserves recipients and does not mutate input',()=>{
 const cc=['owner@example.com','caden@example.com'];
 assert.deepEqual(withAfterHoursRecipient(cc,new Date('2026-09-29T18:00:00Z')),cc);
 assert.deepEqual(withAfterHoursRecipient(cc,new Date('2026-09-29T23:00:00Z')),[...cc,AFTER_HOURS_RECIPIENT]);
 assert.equal(cc.length,2);
});
