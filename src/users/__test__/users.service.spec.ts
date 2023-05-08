import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

class MockRepository {
  DB = [
    {email: 'a@a.com', nickname: 'aaaa', password: 1234, term: true, user_type: 'origin'}
  ]

  existsByEmail(email: string) {
    const users = this.DB.filter(el => el.email === email);
    if(users.length) return users[0];
    return null
  }

  createUser({email, nickname, password, term, user_type}) {
    this.DB.push({email, nickname, password, term, user_type});
    return {email, nickname, password, term, user_type}
  }

}

enum UserType {
  origin = "origin", 
  naver = "naver", 
  google = "google", 
  kakao = "kakao"
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: MockRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('유저 생성하기', () => {
    it('이메일이 존재 하는 경우', async () => {
      try {
        service.createUser({email: 'a@a.com', nickname: 'aaaa', password: '1234', term: true, user_type: UserType.origin})
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('회원 등록 확인', async () => {
      const result = await service.createUser({email: 'a@a.com', nickname: 'aaaa', password: '1234', term: true, user_type: UserType.origin})
      expect(result).toStrictEqual({email: 'a@a.com', nickname: 'aaaa', password: '1234', term: true, user_type: UserType.origin})
    })
  })
});
