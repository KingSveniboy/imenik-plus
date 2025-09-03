export interface PostEntity {
  id: number | null | undefined;
  naslov: string | null | undefined;
  sadrzaj: string | null | undefined;
  createdAt: Date | null | undefined;
  updatedAt: Date | null | undefined;
  userId: number | null | undefined;
}
